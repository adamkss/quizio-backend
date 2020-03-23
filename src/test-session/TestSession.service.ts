import { Injectable } from "@nestjs/common";
import { Question } from '../questions/question.entity';
import { QuizzesService } from "../quizzes/quizzes.service";
import { InjectRepository } from "@nestjs/typeorm";
import { TestSession } from "./TestSession.entity";
import { Repository } from "typeorm";
import { TestsService } from "../tests/tests.service"
import { EntryCode, EntryCodeStatus } from "../tests/entry-code.entity";
import { Test } from "../tests/test.entity";
import { TestQuestion } from "../tests/test-question.entity";
import { TestSessionQuestionState } from "./TestSessionQuestionState.entity";
import { TestQuestionSorter } from "../tests/utils";
import { EntryCodesService } from "../tests/entry-codes.service";

@Injectable()
export class TestSessionService {

    constructor(
        private readonly testsService: TestsService,
        private readonly entryCodesService: EntryCodesService,
        @InjectRepository(TestSession) private readonly testSessionRepository: Repository<TestSession>,
        @InjectRepository(TestSessionQuestionState) private readonly testSessionQuestionStateRepository: Repository<TestSessionQuestionState>
    ) { }

    //let's create a session and return the ID (the session code)
    async createSessionByEntryCode(entryCode: EntryCode): Promise<number> {
        let testSession: TestSession = new TestSession();
        testSession.wasAccessedByEntryCode = true;
        testSession.test = entryCode.test;
        testSession.entryCode = entryCode;

        const test: Test = entryCode.test;
        testSession = await this.testSessionRepository.save(testSession);

        //For each of the question available, we create a TestSessionQuestionState to track if that question is answered
        const testQuestions: TestQuestion[] = await test.questions;
        await Promise.all(testQuestions.map(testQuestion => {
            return new Promise(async (res, rej) => {
                const testSessionQuestionState: TestSessionQuestionState = new TestSessionQuestionState();
                testSessionQuestionState.isAnswered = false;
                testSessionQuestionState.testQuestion = testQuestion;
                testSessionQuestionState.testSession = testSession;
                testSessionQuestionState.testQuestionId = testQuestion.id;
                await this.testSessionQuestionStateRepository.save(testSessionQuestionState);
                res();
            });
        }));
        this.entryCodesService.updateStateOfEntryCode(entryCode, EntryCodeStatus.IN_PROGRESS);
        return testSession.id;
    }

    async getNumberOfTestQuestions(testSessionId: number): Promise<number> {
        const testSession: TestSession = await this.getTestSessionById(testSessionId);
        return (await testSession.testSessionQuestionStates).length;
    }

    async getTestSessionById(id: number): Promise<TestSession> {
        return this.testSessionRepository.findOne(id, {
            relations: ['test']
        });
    }

    async getQuestionsOfSessionOnlyWithId(sessionId: number): Promise<number[]> {
        const testSession: TestSession = await this.getTestSessionById(sessionId);
        const questionsOfTest: TestQuestion[] = await testSession.test.questions;
        return questionsOfTest.sort(TestQuestionSorter).map(question => question.id);
    }

    async getQuestionOfASession(sessionId: number, questionId: number) {
        const testSession = await this.getTestSessionById(sessionId);
        let testQuestion: any = (await this.testSessionQuestionStateRepository.findOne({
            where: {
                testQuestionId: questionId,
                testSession: testSession,
            },
            relations: ['testQuestion', 'testQuestion.questionOptions']
        })).testQuestion;
        return testQuestion;
    }

    async getTestInfoFromSessionId(sessionId: number): Promise<Test> {
        const testSession = await this.testSessionRepository.findOne(sessionId, { relations: ['test'] });
        return testSession.test;
    }

    async submitTest(sessionId, testSubmitQuestionsState: TestSubmitQuestionState[]) {
        const testSession: TestSession = await this.testSessionRepository.findOne(sessionId, {
            relations: ['entryCode']
        });
        this.entryCodesService.updateStateOfEntryCode(
            testSession.entryCode,
            EntryCodeStatus.DONE
        );

        const onlyAnsweredQuestions = testSubmitQuestionsState.filter(tsqs => tsqs.answered);

        let numberOfCorrectAnswers = 0;
        for (const testQuestionState of onlyAnsweredQuestions) {
            const isCorrect = await this.testsService.verifyCorrectAnswer(
                testQuestionState.selectedOption.id,
                testQuestionState.questionId
            );
            if (isCorrect) {
                numberOfCorrectAnswers++;
            }
        }
        testSession.result = (numberOfCorrectAnswers / testSubmitQuestionsState.length) * 100;
        this.testSessionRepository.save(testSession);

        return {
            result: testSession.result
        }
    }
}

//This is the format we get from the UI after submitting a test session
interface TestSubmitQuestionState {
    questionId: number;
    answered: boolean;
    selectedOption: { id: number, questionOptionText: string };
    selectedOptionOrderNr: number;
}