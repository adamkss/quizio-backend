import { Controller, Post, Put, Body, UseGuards, Req, Get, Param, HttpCode, Delete, ForbiddenException } from "@nestjs/common";
import { TestsService, TestSettings } from "./tests.service";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { User } from '../users/user.entity';
import { EntryCodesService } from "./entry-codes.service";
import { EntryCode } from "./entry-code.entity";

@Controller('tests')
export class TestsController {
    constructor(
        private readonly testsService: TestsService,
        private readonly usersService: UsersService,
        private readonly entryCodesService: EntryCodesService,
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
    async getInfoAboutTest(@Req() req, @Param('testId') testId) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return await this.testsService.getTestById(testId);
    }

    @Get('/:testId/questions')
    @UseGuards(AuthGuard('jwt'))
    async getTestQuestionsOfTest(@Req() req, @Param('testId') testId) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return await this.testsService.getTestQuestionsOfTest(testId);
    }

    @Post('/:testId/questions')
    @UseGuards(AuthGuard('jwt'))
    async createQuestion(
        @Req() req,
        @Param('testId') testId,
        @Body() { questionText, initialQuestionOptions }
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return await this.testsService.createTestQuestion(
            testId,
            questionText,
            initialQuestionOptions
        );
    }

    @Post('/questions/:questionId/options')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(201)
    async addQuestionOptionToQuestion(
        @Req() req,
        @Param('questionId') questionId,
        @Body() { questionOptionText }
    ) {
        await this.verifyIsUserOwnerOfQuestion(req.user.id, questionId);
        return await this.testsService.addQuestionOptionToQuestion(questionId, questionOptionText);
    }

    @Put(`/questions/:questionId/correctOption`)
    @UseGuards(AuthGuard('jwt'))
    async updateCorrectAnswer(
        @Req() req,
        @Param('questionId') questionId,
        @Body() { questionOptionId }
    ) {
        await this.verifyIsUserOwnerOfQuestion(req.user.id, questionId);
        await this.testsService.updateCorrectAnswerOnQuestion(
            questionId,
            questionOptionId
        );
    }

    @Get('/questions/:questionId')
    @UseGuards(AuthGuard('jwt'))
    async getQuestion(
        @Req() req,
        @Param('questionId') questionId
    ) {
        await this.verifyIsUserOwnerOfQuestion(req.user.id, questionId);
        return await this.testsService.getQuestionInformationForAdmin(questionId);
    }

    @Delete('/question-options/:questionOptionId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async deleteQuestionOption(
        @Req() req,
        @Param('questionOptionId') questionOptionId
    ) {
        await this.verifyIsUserOwnerOfQuestionOption(req.user.id, questionOptionId);
        return await this.testsService.deleteQuestionOption(questionOptionId);
    }

    @Delete('/questions/:questionId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async deleteQuestion(
        @Req() req,
        @Param('questionId') questionId
    ) {
        await this.verifyIsUserOwnerOfQuestion(req.user.id, questionId);
        return await this.testsService.deleteQuestion(questionId);
    }

    @Put('/:testId/questionOrders')
    @UseGuards(AuthGuard('jwt'))
    async moveQuestions(
        @Req() req,
        @Param('testId') testId,
        @Body() { sourceIndex, targetIndex }
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        await this.testsService.changeQuestionOrders(testId, sourceIndex + 1, targetIndex + 1);
    }

    @Post('/:testId/entryCodes')
    @UseGuards(AuthGuard('jwt'))
    async createNewEntryCode(
        @Req() req,
        @Param('testId') testId,
        @Body() { numberOfNewEntryCodes }
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return (await this.entryCodesService.generateNewCode(
            await this.testsService.getTestById(testId),
            numberOfNewEntryCodes
        )).map((code: EntryCode) => {
            return {
                id: code.id,
                code: code.code,
                name: code.name
            }
        });
    }

    @Put('/:testId/entryCodes/:entryCodeId/name')
    @UseGuards(AuthGuard('jwt'))
    async updateNameOfEntryCode(
        @Req() req,
        @Param('testId') testId,
        @Param('entryCodeId') entryCodeId, @Body() { newName }
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        await this.entryCodesService.updateNameOfEntryCode(entryCodeId, newName);
    }

    @Get('/:testId/entryCodes/unfinished')
    @UseGuards(AuthGuard('jwt'))
    async getAllUnfinishedEntryCodesOfATest(
        @Req() req,
        @Param('testId') testId
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return await this.entryCodesService.getAllUnfinishedEntryCodesOfATest(
            await this.testsService.getTestById(testId)
        )
    }

    @Get('/:testId/entryCodes/finished')
    @UseGuards(AuthGuard('jwt'))
    async getAllFinishedEntryCodesOfATest(
        @Req() req,
        @Param('testId') testId
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        return (await this.entryCodesService.getAllFinishedEntryCodesOfATest(
            await this.testsService.getTestById(testId)
        )).map(entryCode => {
            const { testSession, ...withoutTestSession } = entryCode;
            return {
                ...withoutTestSession,
                result: testSession.result
            }
        })
    }

    @Put('/:testId/settings')
    @UseGuards(AuthGuard('jwt'))
    async updateSettings(
        @Req() req,
        @Param('testId') testId,
        @Body() settings: TestSettings
    ) {
        await this.verifyIsUserOwner(req.user.id, testId);
        await this.testsService.changeSettings(testId, settings);
    }

    async isUserOwner(userId, testId): Promise<boolean> {
        const user: User = await this.testsService.getTestsOwner(testId);
        return user.id == userId;
    }

    async verifyIsUserOwner(userId, testId): Promise<void> {
        const isUserOwner = await this.isUserOwner(userId, testId);
        if (!isUserOwner)
            throw new ForbiddenException();
    }

    async verifyIsUserOwnerOfQuestion(userId, questionId): Promise<void> {
        const isUserOwner: boolean = (await this.testsService.getQuestionOwner(questionId)).id == userId;
        if (!isUserOwner) {
            throw new ForbiddenException();
        }
    }

    async verifyIsUserOwnerOfQuestionOption(userId, questionOptionId): Promise<void> {
        const isUserOwner: boolean = (await this.testsService.getQuestionOptionOwner(questionOptionId)).id == userId;
        if (!isUserOwner) {
            throw new ForbiddenException();
        }
    }
}