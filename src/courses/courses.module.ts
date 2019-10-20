import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Question } from '../questions/question.entity';
import { QuestionOption } from '../question-options/questionOption.entity';
import { QuizzesModule } from 'src/quizzes/quizzes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    QuizzesModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService]
})
export class CoursesModule { }
