import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { Course } from '../courses/course.entity';
import { Repository, DeleteResult } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
        private readonly questionService: QuestionsService
    ) { }

    async createQuiz(quizName: string, owner: User, course?: Course): Promise<any> {
        const quiz = new Quiz();
        quiz.name = quizName;
        quiz.course = course;
        quiz.owner = owner;
        const newQuizz = await this.quizRepository.save(quiz);
        const { owner: ownerInfo, ...newQuizzData } = newQuizz;
        return newQuizzData;
    }

    getQuizById(id: number): Promise<Quiz> {
        return this.quizRepository.findOne(id);
    }

    async getQuizByIdSafe(id): Promise<any> {
        const quiz: Quiz = await this.quizRepository.findOne(id);
        const {owner, ...safeQuizInfo} = quiz;
        return safeQuizInfo;
    }

    async getAllQuestionsOfAQuiz(quizId) {
        const quiz = await this.getQuizById(quizId);
        const questions = await quiz.questions;
        return await Promise.all(questions.map((question) => this.questionService.getQuestionById(question.id)));
    }

    async deleteQuiz(quizId) {
        const quiz: Quiz = await this.quizRepository.findOne(quizId);
        const questions: Question[] = await quiz.questions;
        await Promise.all(questions.map(question => this.questionService.deleteQuestion(question)));

        const res: DeleteResult = await this.quizRepository.delete(quizId);
        return res.affected === 1;
    }

    async createQuestion(quizId, questionTitle: string, options: string[], rightAnswer: string) {
        return await this.questionService.createQuestion(
            await this.getQuizById(quizId),
            questionTitle,
            options,
            rightAnswer
        );
    }

    async updateQuizSettings(quizId, newQuizName, askForQuiztakerName, showResultAtEndOfQuiz) {
        const quizToUpdate: Quiz = await this.quizRepository.findOne(quizId);
        quizToUpdate.name = newQuizName;
        quizToUpdate.askForQuizTakerName = askForQuiztakerName;
        quizToUpdate.showResultAtTheEnd = showResultAtEndOfQuiz;

        await this.quizRepository.save(quizToUpdate);
    }
}
