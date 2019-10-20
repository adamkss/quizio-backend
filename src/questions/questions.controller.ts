import { Controller, Post, Param, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
    constructor(
        private readonly questionsService: QuestionsService
    ) { }

    @Post('/:questionId/questionOptions')
    async addOptionToQuestion(@Param("questionId") questionId, @Body() { questionOption }) {
        return await this.questionsService.addOptionToQuestion(questionId, questionOption);
    }

    @Delete('/:questionId')
    @HttpCode(204)
    async deleteQuestion(@Param('questionId') questionId) {
        await this.questionsService.deleteQuestion(questionId);
    }
    
    @Put('/:questionId/rightAnswer')
    async updateRightAnswerToQuestion(@Param("questionId") questionId, @Body() { newCorrectQuestionOptionId }) {
        return await this.questionsService.setNewRightAnswerToQuestion(questionId, newCorrectQuestionOptionId);
    }

    @Delete('/:questionId/questionOptions/:questionOptionId')
    async deleteQuestionOptionFromQuestion(
        @Param("questionId") questionId,
        @Param("questionOptionId") questionOptionId
    ) {
        return await this.questionsService.deleteAnswerFromQuestion(questionId, questionOptionId);
    }
}
