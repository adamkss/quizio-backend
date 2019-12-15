import { Controller, Get, Param, Post, Body, Res, Delete, UseGuards, Request } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Quiz } from './quiz.entity';

@Controller('genericQuizzes')
export class GenericQuizzesController {
    constructor(
        private readonly quizzesService: QuizzesService,
        private readonly usersService: UsersService
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createGenericQuiz(@Body() {newQuizName}: NewQuizInfo, @Request() req) {
        const owner: User = await this.usersService.getUserById(req.user.id);
        return await this.quizzesService.createQuiz(newQuizName, owner);
    }

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

    @Get('/myQuizzes')
    @UseGuards(AuthGuard('jwt'))
    async getQuizzesOfCurrentUser(@Request() req): Promise<Quiz[]> {
        const userId = req.user.id;
        const user:User = await this.usersService.getUserById(userId);
        return await user.ownedQuizzes;
    }
}

interface NewQuizInfo { 
    newQuizName: string
}