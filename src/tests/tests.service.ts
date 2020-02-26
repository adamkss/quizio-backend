import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "./test.entity";
import { Repository, MoreThan } from 'typeorm';
import { User } from "src/users/user.entity";
import { TestQuestion } from "./test-question.entity";
import { TestQuestionOption } from "./test-question-option.entity";

@Injectable()
export class TestsService {
    constructor(
        @InjectRepository(Test) private readonly testsRepository: Repository<Test>,
        @InjectRepository(TestQuestion) private readonly testQuestionsRepository: Repository<TestQuestion>,
        @InjectRepository(TestQuestionOption) private readonly testQuestionOptionsRepository: Repository<TestQuestionOption>,
    ) { }

    async createTest(testName: string, owner: User): Promise<any> {
        const test: Test = new Test();
        test.name = testName;
        test.owner = owner;
        test.numberOfQuestions = 0;
        const { owner: testOwner, ...testWithoutOwner } = await this.testsRepository.save(test);
        return testWithoutOwner;
    }

    async getTestById(testId) {
        return this.testsRepository.findOne(testId);
    }

    //gets a test question with all of the question options (thus the complexity... TODO refactor!)
    async getTestQuestionsOfTest(testId): Promise<any[]> {
        const test: Test = await this.testsRepository.findOne(testId);
        const questions = await test.questions;
        return await Promise.all(
            questions.map(question =>
                new Promise((resolve, rej) => {
                    (async () => {
                        resolve({
                            ...question,
                            questionOptions: await question.questionOptions
                        })
                    })();
                })
            )
        )
    }

    async createTestQuestion(testId, questionText, initialQuestionOptions) {
        const test: Test = await this.getTestById(testId);

        const testQuestion: TestQuestion = new TestQuestion();
        testQuestion.questionTitle = questionText;
        testQuestion.test = test;
        testQuestion.questionOrderNumber = test.numberOfQuestions + 1;
        await this.testQuestionsRepository.save(testQuestion);

        for (const index in initialQuestionOptions) {
            const questionOption = new TestQuestionOption();
            questionOption.questionOptionText = initialQuestionOptions[index];
            questionOption.testQuestion = testQuestion;
            questionOption.amITheRightAnswer = false;
            await this.testQuestionOptionsRepository.save(questionOption);
        }

        test.numberOfQuestions = test.numberOfQuestions + 1;
        await this.testsRepository.save(test);
    }

    async addQuestionOptionToQuestion(questionId, questionOptionText) {
        const question: TestQuestion = await this.testQuestionsRepository.findOne(questionId);

        const testQuestionOption: TestQuestionOption = new TestQuestionOption();
        testQuestionOption.amITheRightAnswer = false;
        testQuestionOption.questionOptionText = questionOptionText;
        testQuestionOption.testQuestion = question;

        const savedQuestionOption = await this.testQuestionOptionsRepository.save(testQuestionOption);
        const { testQuestion, ...restKeys } = savedQuestionOption;
        return restKeys;
    }

    async updateCorrectAnswerOnQuestion(questionId, newCorrectQuestionOptionId) {
        const question = await this.testQuestionsRepository.findOne(questionId);
        const questionOptions: TestQuestionOption[] = await question.questionOptions;

        await Promise.all(questionOptions.map(questionOption =>
            new Promise(async (resolve, rej) => {
                questionOption.amITheRightAnswer =
                    questionOption.id == newCorrectQuestionOptionId ? true : false;
                await this.testQuestionOptionsRepository.save(questionOption);
                resolve();
            })
        ));
    }

    async getQuestionInformationForAdmin(questionId) {
        const questionWithOptions = await this.testQuestionsRepository.findOne(questionId, {
            relations: ["questionOptions"]
        });
        const questionOptions = questionWithOptions['__questionOptions__'];
        delete questionWithOptions['__questionOptions__'];
        return {
            ...questionWithOptions,
            questionOptions
        }
    }

    async deleteQuestionOption(questionOptionId) {
        await this.testQuestionOptionsRepository.delete(questionOptionId);
    }

    async deleteQuestion(questionId) {
        const question: TestQuestion = await this.testQuestionsRepository.findOne(questionId, { relations: ['test'] });
        const test: Test = question.test;
        const questionOrderNumber = question.questionOrderNumber;
        const questionsWithHigherOrderNumber: TestQuestion[] = await this.testQuestionsRepository.find({
            questionOrderNumber: MoreThan(questionOrderNumber)
        });

        test.numberOfQuestions = test.numberOfQuestions - 1;
        await this.testQuestionsRepository.delete(questionId);
        await this.testsRepository.save(test);
        await Promise.all(questionsWithHigherOrderNumber.map(question =>
            new Promise(async (resolve, reject) => {
                question.questionOrderNumber--;
                await this.testQuestionsRepository.save(question);
                resolve();
            })
        ));
    }
}