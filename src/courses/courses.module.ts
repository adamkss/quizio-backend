import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { QuestionOption } from './questionOption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Quiz, Question, QuestionOption])],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
