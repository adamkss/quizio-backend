import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { QuestionsModule } from '../questions/questions.module';
import { GenericQuizzesController } from './generic-quizzes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    QuestionsModule
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController, GenericQuizzesController],
  exports: [QuizzesService]
})
export class QuizzesModule { }
