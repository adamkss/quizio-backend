import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { Course } from '../courses/course.entity';
import { Repository, DeleteResult } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/question.entity';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
        private readonly questionService: QuestionsService
    ) { }

    async createQuiz(quizName: string, course?: Course): Promise<Quiz> {
        const quiz = new Quiz();
        quiz.name = quizName;
        quiz.course = course;

        return await this.quizRepository.save(quiz);
    }

    getQuizById(id: number): Promise<Quiz> {
        return this.quizRepository.findOne(id);
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
}
