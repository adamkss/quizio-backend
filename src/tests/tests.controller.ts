import { Controller, Post, Put, Body, UseGuards, Req, Get, Param, HttpCode, Delete } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { User } from '../users/user.entity';

@Controller('tests')
export class TestsController {
    constructor(
        private readonly testsService: TestsService,
        private readonly usersService: UsersService
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllTestsOfUser(@Req() request) {
        const user: User = await this.usersService.getUserById(request.user.id);
        return await user.ownedTests;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTest(@Req() request, @Body() { testName }): Promise<any> {
        const owner: User = await this.usersService.getUserById(request.user.id);

        return await this.testsService.createTest(testName, owner);
    }

    @Get('/:testId')
    @UseGuards(AuthGuard('jwt'))
    async getInfoAboutTest(@Param('testId') testId) {
        return await this.testsService.getTestById(testId);
    }

    @Get('/:testId/questions')
    @UseGuards(AuthGuard('jwt'))
    async getTestQuestionsOfTest(@Param('testId') testId) {
        return await this.testsService.getTestQuestionsOfTest(testId);
    }

    @Post('/:testId/questions')
    async createQuestion(@Param('testId') testId, @Body() { questionText, initialQuestionOptions }) {
        return await this.testsService.createTestQuestion(
            testId,
            questionText,
            initialQuestionOptions
        );
    }

    @Post('/questions/:questionId/options')
    @HttpCode(201)
    async addQuestionOptionToQuestion(@Param('questionId') questionId, @Body() { questionOptionText }) {
        return await this.testsService.addQuestionOptionToQuestion(questionId, questionOptionText);
    }

    @Put(`/questions/:questionId/correctOption`)
    async updateCorrectAnswer(@Param('questionId') questionId, @Body() { questionOptionId }) {
        await this.testsService.updateCorrectAnswerOnQuestion(
            questionId,
            questionOptionId
        );
    }

    @Get('/questions/:questionId')
    async getQuestion(@Param('questionId') questionId) {
        return await this.testsService.getQuestionInformationForAdmin(questionId);
    }

    @Delete('/question-options/:questionOptionId')
    @HttpCode(204)
    async deleteQuestionOption(@Param('questionOptionId') questionOptionId) {
        return await this.testsService.deleteQuestionOption(questionOptionId);
    }

    @Delete('/questions/:questionId')
    @HttpCode(204)
    async deleteQuestion(@Param('questionId') questionId) {
        return await this.testsService.deleteQuestion(questionId);
    }

    @Put('/:testId/questionOrders')
    async moveQuestions(@Param('testId') testId, @Body() { sourceIndex, targetIndex }) {
        await this.testsService.changeQuestionOrders(testId, sourceIndex + 1, targetIndex + 1);
    }
}