import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionOptionsModule } from '../question-options/question-options.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    QuestionOptionsModule
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService]
})
export class QuestionsModule { }
