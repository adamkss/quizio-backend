import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { QuizSessionService } from './QuizSession.service';

@Controller('quiz-sessions')
export class QuizSessionController {
    constructor(
        private readonly quizService: QuizSessionService
    ) { }

    @Post('/by-quizzes/:quizId')
    async createSessionForQuiz(@Param('quizId') quizId) {
        return {
            sessionId: await this.quizService.createNewSessionForQuiz(quizId)
        }
    }

    @Get('/:sessionId/nextQuestion')
    getNextQuestionForQuiz(@Param('sessionId') sessionId) {
      return this.quizService.getNextQuestionForSession(sessionId);
    }
    
    @Post('/:sessionId/clientAnswers')
    verifyAnswer(@Param('sessionId') sessionCode, @Body() body: any) {
        return this.quizService.validateAnswerForQuestion(sessionCode, body.questionId, body.answerId);
    }
}
