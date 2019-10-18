import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CorsMiddleware} from './middleware/cors.middleware';
import { QuizModule } from './quiz/Quiz.module';
import { UserService } from './entities/User/User.service';
import { User } from './entities/User/User.entity';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    QuizModule,
    CoursesModule
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule{ 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');
  }
}
