import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { TestSessionService } from './TestSession.service';
import { EntryCodesService } from 'src/tests/entry-codes.service';

@Controller('test-sessions')
export class TestSessionController {
    constructor(
        private readonly testSessionService: TestSessionService,
        private readonly entryCodesService: EntryCodesService,
    ) { }

    @Post('/by-entry-codes/:entryCode')
    async createSessionForQuiz(@Param('entryCode') entryCode) {
        return {
            sessionId: await this.testSessionService.createSessionByEntryCode(
                await this.entryCodesService.getEntryCodeByCode(entryCode)
            )
        }
    }

    @Get('/:sessionId/numberOfQuestions')
    async getNumberOfQuestions(@Param('sessionId') sessionId): Promise<number> {
        return await this.testSessionService.getNumberOfTestQuestions(sessionId);
    }

    @Get('/:sessionId/questionsWithIdsOnly')
    async getQuestionsOfSessionWithIdsOnly(@Param('sessionId') sessionId): Promise<number[]> {
        return await this.testSessionService.getQuestionsOfSessionOnlyWithId(sessionId);
    }

    @Get('/:sessionId/questions/:questionId')
    async getQuestionOfASession(@Param('sessionId') sessionId, @Param('questionId') questionId) {
        return await this.testSessionService.getQuestionOfASession(
            sessionId,
            questionId
        );
    }

    // @Get('/:sessionId/nextQuestion')
    // getNextQuestionForQuiz(@Param('sessionId') sessionId) {
    //     return this.testSessionService.getNextQuestionForSession(sessionId);
    // }

    // @Post('/:sessionId/clientAnswers')
    // verifyAnswer(@Param('sessionId') sessionCode, @Body() body: any) {
    //     return this.testSessionService.validateAnswerForQuestion(sessionCode, body.questionId, body.answerId);
    // }

    // @Get('/:sessionId/statistics')
    // getStatistics(@Param('sessionId') sessionId) {
    //     return this.testSessionService.getQuizStatistics(sessionId);
    // }

    // @Post('/:sessionId/abandon')
    // abandonSesssion(@Param('sessionId') sessionId) {
    //     this.testSessionService.abandonQuizSession(sessionId);
    // }
}
