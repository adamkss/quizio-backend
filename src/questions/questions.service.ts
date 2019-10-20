import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/questions/question.entity';
import { Repository } from 'typeorm';
import { Quiz } from 'src/quizzes/quiz.entity';
import { QuestionOptionsService } from 'src/question-options/question-options.service';
import { QuestionOption } from 'src/question-options/questionOption.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        private readonly questionOptionsService: QuestionOptionsService
    ) { }

    async getQuestionById(questionId): Promise<Question> {
        return await this.questionRepository.findOne(questionId);
    }

    async createQuestion(quiz: Quiz, questionTitle: string, options: string[], rightAnswer: string) {
        let question = new Question();
        question.question = questionTitle;
        question.quiz = quiz;
        await this.questionRepository.save(question);
        await this.questionOptionsService.addQuestionOptionsToQuestion(question, options, rightAnswer);
    }

    async deleteQuestion(questionId) {
        const question: Question = await this.questionRepository.findOne(questionId);
        await this.questionOptionsService.deleteQuestionOptions(question.questionOptions);
        await this.questionRepository.delete(questionId);
    }

    async addOptionToQuestion(questionId, questionOption: string) {
        const question: Question = await this.getQuestionById(questionId);
        return await this.questionOptionsService.addOptionToQuestion(question, questionOption);
    }

    async setNewRightAnswerToQuestion(questionId, newCorrectQuestionOptionId) {
        return await this.questionOptionsService.setNewRightAnswerToQuestion(
            await this.getQuestionById(questionId),
            newCorrectQuestionOptionId
        );
    }

    async deleteAnswerFromQuestion(questionId, questionOptionId): Promise<QuestionOption[]> {
        return await this.questionOptionsService.deleteAnswerFromQuestion(
            await this.getQuestionById(questionId),
            questionOptionId
        );
    }
}
