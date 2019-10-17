import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Course } from './course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { QuestionOption } from './questionOption.entity';

const getQuestionOptionsWithoutParentQuestion = (questionOptions: QuestionOption[]): QuestionOption[] => {
    return questionOptions.map(questionOption => ({
        ...questionOption,
        question: null
    }));
}

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course) private readonly coursesRepository: Repository<Course>,
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        @InjectRepository(QuestionOption) private readonly questionOptionsRepository: Repository<QuestionOption>
    ) { }

    getAllCourses(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    getCourseById(id: number): Promise<Course> {
        return this.coursesRepository.findOne(id);
    }

    createCourse({ courseName }) {
        const course = new Course();
        course.courseName = courseName;

        return this.coursesRepository.save(course);
    }

    getQuizById(id: number): Promise<Quiz> {
        return this.quizRepository.findOne(id);
    }

    async createQuiz(courseId, quizName): Promise<Quiz> {
        const course = await this.getCourseById(courseId);
        console.log(courseId, course);

        const quiz = new Quiz();
        quiz.name = quizName;
        quiz.course = await this.getCourseById(courseId);

        return await this.quizRepository.save(quiz);
    }

    async createQuestion(quizId: number, questionTitle: string, options: string[], rightAnswer: string) {
        const quizToAssignQuestionTo = await this.getQuizById(quizId);

        let question = new Question();
        question.question = questionTitle;
        question.quiz = quizToAssignQuestionTo;
        await this.questionRepository.save(question);

        for (const option of options) {
            const questionOption = new QuestionOption();
            questionOption.title = option;
            questionOption.question = question;
            if (option == rightAnswer) {
                questionOption.amITheRightAnswer = true;
            } else {
                questionOption.amITheRightAnswer = false;
            }
            await this.questionOptionsRepository.save(questionOption);
        }
    }

    async addOptionToQuestion(questionId: number, option: string): Promise<any[]> {
        const question = await this.questionRepository.findOne(questionId);

        let questionOption = new QuestionOption();
        questionOption.question = question;
        questionOption.title = option;
        questionOption.amITheRightAnswer = false;
        await this.questionOptionsRepository.save(questionOption);

        question.questionOptions = [...question.questionOptions, questionOption];

        return question.questionOptions.map(questionOption => ({ ...questionOption, question: null }));
    }

    async getAllQuizesOfCourse(courseId) {
        const course = await this.getCourseById(courseId);
        const quizes = await course.quizes;
        return quizes;
    }

    async getAllQuestionsOfAQuiz(quizId) {
        const quiz = await this.getQuizById(quizId);
        const questions = await quiz.questions;
        return await Promise.all(questions.map((question) => this.questionRepository.findOne(question.id)));
    }

    async setNewRightAnswerToQuestion(questionId, questionOptionId) {
        const question: Question = await this.questionRepository.findOne(questionId);

        //first we set all question options to false
        await Promise.all(question.questionOptions.map(questionOption => {
            if (questionOption.id === questionOptionId)
                questionOption.amITheRightAnswer = true;
            else
                questionOption.amITheRightAnswer = false;
            return this.questionOptionsRepository.save(questionOption);
        }));

        return question.questionOptions.map(questionOption => ({ ...questionOption, question: null }));
    }

    async deleteAnswerFromQuestion(questionId, questionOptionId): Promise<QuestionOption[]> {
        await this.questionOptionsRepository.delete(questionOptionId);
        const question: Question = await this.questionRepository.findOne(questionId);
        return getQuestionOptionsWithoutParentQuestion(question.questionOptions);
    }

    async deleteQuestion(questionId) {
        const question: Question = await this.questionRepository.findOne(questionId);
        await this.questionOptionsRepository.remove(question.questionOptions);
        await this.questionRepository.delete(questionId);
    }

    async deleteQuiz(courseId, quizId) {
        const quiz:Quiz = await this.quizRepository.findOne(quizId);
        const questions:Question[] = await quiz.questions;
        await Promise.all(questions.map(question => question.id).map(questionId => this.deleteQuestion(questionId)));

        const res: DeleteResult = await this.quizRepository.delete(quizId);
        return res.affected === 1;
    }
}
