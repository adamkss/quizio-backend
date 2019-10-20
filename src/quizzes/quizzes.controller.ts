import { Controller, Get, Param, Post, Body, Res, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
    constructor(
        private readonly quizzesService: QuizzesService
    ) { }

    @Get('/:quizId/questions')
    async getAllQuestionsOfQuiz(@Param('quizId') quizId) {
        return await this.quizzesService.getAllQuestionsOfAQuiz(quizId);
    }

    @Post('/:quizId/questions')
    async createQuestion(@Param('quizId') quizId, @Body() { questionTitle, options, rightAnswer }) {
        const quiz = await this.quizzesService.createQuestion(
            quizId,
            questionTitle,
            options,
            rightAnswer
        );
        return quiz;
    }

    @Delete('/:quizId')
    async deleteQuiz(@Param('quizId') quizId, @Res() response) {
        const wasDeletedSuccessfully = await this.quizzesService.deleteQuiz(quizId);
        wasDeletedSuccessfully ? response.status(204).end() : response.status(404).end();
    }
}
