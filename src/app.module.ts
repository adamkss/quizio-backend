import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './entities/User/User.module';
import {CorsMiddleware} from '../src/middleware/cors.middleware';
import { QuizModule } from './quiz/Quiz.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    QuizModule
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
