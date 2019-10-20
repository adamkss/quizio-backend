import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CorsMiddleware} from './middleware/cors.middleware';
import { QuizSessionModule } from './quiz_session/QuizSession.module';
import { CoursesModule } from './courses/courses.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionOptionsModule } from './question-options/question-options.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    QuizSessionModule,
    CoursesModule,
    QuizzesModule,
    QuestionsModule,
    QuestionOptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{ 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');
  }
}
