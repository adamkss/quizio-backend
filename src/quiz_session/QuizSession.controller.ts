import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { QuizSessionService } from './QuizSession.service';

@Controller('quizzes')
export class QuizSessionController {
    constructor(
        private readonly quizService: QuizSessionService
    ) { }

    @Post('/:quizId/quizSessions/')
    async createSessionForQuiz(@Param('quizId') quizId) {
        return {
            sessionId: await this.quizService.createNewSessionForQuiz(quizId)
        }
    }

    @Get('/quizSessions/:sessionId/nextQuestion')
    getNextQuestionForQuiz(@Param('sessionId') sessionId) {
      return this.quizService.getNextQuestionForSession(sessionId);
    }
    
    @Post('/:quizId/clientAnswers')
    verifyAnswer(@Param('quizId') quizId, @Body() body: any) {
        return this.quizService.validateAnswerForQuestion(quizId, body.questionId, body.answerId);
    }
}
