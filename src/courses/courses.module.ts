import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';

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
