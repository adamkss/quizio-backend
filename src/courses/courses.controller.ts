import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Quiz } from 'src/quizzes/quiz.entity';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService
    ) { }

    @Get()
    async getAllCourses() {
        return await this.coursesService.getAllCourses();
    }

    @Post()
    async createCourse(@Body() newCourseData: NewCourseData) {
        const newCourse = await this.coursesService.createCourse(newCourseData);
        return newCourse;
    }

    @Get('/:courseId/quizes/')
    async getAllQuizesOfCourse(@Param('courseId') courseId) {
        return await this.coursesService.getAllQuizesOfCourse(courseId);
    }

    @Post('/:courseId/quizzes')
    async createQuiz(@Param('courseId') courseId, @Body() { quizName }: NewQuizData): Promise<Quiz> {
        return await this.coursesService.createQuiz(courseId, quizName);
    }
}

interface NewCourseData {
    courseName: string;
}

interface NewQuizData {
    courseId: number,
    quizName: string
}