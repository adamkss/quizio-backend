import { Injectable } from "@nestjs/common";
import { Question } from '../questions/question.entity';
import { QuizzesService } from "../quizzes/quizzes.service";
import { InjectRepository } from "@nestjs/typeorm";
import { TestSession } from "./TestSession.entity";
import { Repository } from "typeorm";
import { TestsService } from "../tests/tests.service"
import { EntryCode } from "../tests/entry-code.entity";
import { Test } from "../tests/test.entity";
import { TestQuestion } from "src/tests/test-question.entity";
import { TestSessionQuestionState } from "./TestSessionQuestionState.entity";
import { TestQuestionSorter } from "src/tests/utils";

@Injectable()
export class TestSessionService {

    constructor(
        private readonly testsService: TestsService,
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

    // private initializeQuestionsForSession(sessionCode: string, testId, questions: Question[], isForLearning: boolean, entryCode) {
    //     const sessionData = {
    //         questions: [...questions],
    //         testId,
    //         wronglyAnsweredQuestionsIndexes: [],
    //         nextQuestionIndex: 0,
    //         wereAllAnsweredAtLeastOnce: false,
    //         progressUnit: (1 / questions.length) * 100,
    //         progress: 0,
    //         waitingAnswerForQuestion: null,
    //         isForLearning,
    //         entryCode,
    //         savedToDB: false,
    //     };

    //     this.sessionsQuestionsMap[sessionCode] = sessionData;
    // }

    // async saveFinishedQuizSession(sessionData) {
    //     const testSession: TestSession = new TestSession();
    //     testSession.entryCode = sessionData.quizTakerName;
    //     testSession.result = sessionData.progress;
    //     testSession.date = new Date().toLocaleString();
    //     testSession.test = await this.testsService.getTestById(sessionData.testId);
    //     await this.testSessionRepository.save(testSession);
    // }

    // getNextQuestionForSession(sessionCode) {
    //     const sessionData = this.sessionsQuestionsMap[sessionCode];

    //     if (sessionData.nextQuestionIndex == sessionData.questions.length) {
    //         sessionData.wereAllAnsweredAtLeastOnce = true;
    //     }

    //     if (sessionData.waitingAnswerForQuestion) {
    //         return {
    //             question: sessionData.waitingAnswerForQuestion,
    //             done: false,
    //             progress: sessionData.progress
    //         }
    //     }

    //     if (sessionData.wereAllAnsweredAtLeastOnce) {
    //         console.log('all finished taking if any left...')
    //         if (sessionData.wronglyAnsweredQuestionsIndexes.length > 0) {
    //             const questionIndex = sessionData.wronglyAnsweredQuestionsIndexes[0];

    //             sessionData.waitingAnswerForQuestion = sessionData.questions[questionIndex];
    //             return {
    //                 question: sessionData.questions[questionIndex],
    //                 done: false,
    //                 progress: sessionData.progress
    //             }
    //         } else {
    //             //The quiz is done. Save it in the DB if it hasn't been saved yet and return Done to the user.
    //             if (!sessionData.savedToDB) {
    //                 this.saveFinishedQuizSession(sessionData);
    //                 sessionData.savedToDB = true;
    //             }

    //             return {
    //                 question: null,
    //                 done: true,
    //                 progress: sessionData.progress
    //             };
    //         }
    //     } else {
    //         sessionData.waitingAnswerForQuestion = sessionData.questions[sessionData.nextQuestionIndex];
    //         return {
    //             question: sessionData.questions[sessionData.nextQuestionIndex++],
    //             done: false,
    //             progress: sessionData.progress
    //         }
    //     }
    // }

    // validateAnswerForQuestion(sessionCode: string, questionId: number, optionSelectedOrderNumber: number) {
    //     const sessionData = this.sessionsQuestionsMap[sessionCode];
    //     const question = sessionData.questions.find(question => question.id === questionId);
    //     const questionIndexInQuestions = sessionData.questions.indexOf(question);

    //     if (question) {
    //         if (sessionData.waitingAnswerForQuestion.id === questionId) {
    //             sessionData.waitingAnswerForQuestion = null;
    //             if (sessionData.wereAllAnsweredAtLeastOnce) {
    //                 sessionData.wronglyAnsweredQuestionsIndexes.splice(
    //                     0,
    //                     1
    //                 );
    //             }
    //         }

    //         if (question.questionOptions[optionSelectedOrderNumber].amITheRightAnswer) {
    //             sessionData.progress += sessionData.progressUnit;
    //             return {
    //                 valid: true,
    //                 progress: sessionData.progress
    //             };
    //         } else {
    //             if (sessionData.isForLearning) {
    //                 console.log('Pushed to wrong answers')
    //                 sessionData.wronglyAnsweredQuestionsIndexes.push(questionIndexInQuestions);
    //             }
    //             return {
    //                 valid: false,
    //                 progress: 0
    //             };
    //         }
    //     } else {
    //         throw new Error('Question not found in session.');
    //     }
    // }

    // async createNewSessionForQuiz(testId, isForLearning, options) {
    //     //Generate a random session id for the quiz
    //     let nextSessionId;
    //     do {
    //         nextSessionId = Math.ceil(Math.random() * 1000);
    //     } while (this.sessionsQuestionsMap[nextSessionId]);

    //     this.initializeQuestionsForSession(nextSessionId, testId, await this.quizzesService.getAllQuestionsOfAQuiz(testId), isForLearning, options);

    //     return nextSessionId;
    // }

    // getQuizStatistics(sessionId) {
    //     const session = this.sessionsQuestionsMap[sessionId];
    //     return {
    //         progress: Math.round(session.progress)
    //     }
    // }

    // abandonQuizSession(sessionId) {
    //     this.sessionsQuestionsMap[sessionId] = null;
    // }
}