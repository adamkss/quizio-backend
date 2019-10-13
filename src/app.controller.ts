import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './entities/User/User.service';
import { QuizService } from './quiz/Quiz.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly quizService: QuizService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/users')
  async createUser(@Body() user: any) {
    return await this.userService.insertUser(user.name);
  }

  @Get('/quizzes/quizSessions/:sessionId')
  getNextQuestionForQuiz(@Param('sessionId') sessionId) {
    return this.quizService.getNextQuestionForSession(sessionId);
  }

  @Post('/quiz/:quizId/addClientAnswer')
  verifyAnswer(@Param('quizId') quizId, @Body() body: any) {
    return this.quizService.validateAnswerForQuestion(quizId, body.questionId, body.answerId);
  }

  @Post('/quizzes/:quizId/quizSessions/')
  async createSessionForQuiz(@Param('quizId') quizId) {
    return {
      sessionId: await this.quizService.createNewSessionForQuiz(quizId)
    }
  }
}