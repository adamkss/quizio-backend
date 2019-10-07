import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService
    ) {}

    @Get()
    async getAllCourses() {
        return await this.coursesService.getAllCourses();
    }

    @Post()
    async createCourse(@Body() newCourseData:NewCourseData) {
        const newCourse = await this.coursesService.createCourse(newCourseData);
        return newCourse;
    }

    @Get('/:courseId/quizes/')
    async getAllQuizesOfCourse(@Param('courseId') courseId) {
        return await this.coursesService.getAllQuizesOfCourse(courseId);
    }

    @Post('/quizes')
    async createQuiz(@Body() {courseId, quizName}: NewQuizData) {
        const newQuiz = await this.coursesService.createQuiz(courseId, quizName);
        return newQuiz;
    }

    @Post('/quizes/:quizId/questions')
    async createQuestion(@Param('quizId') quizId, @Body() {questionTitle, options, rightAnswer}) {
        const quiz = await this.coursesService.createQuestion(
            quizId,
            questionTitle,
            options,
            rightAnswer
        );
        return quiz;
    }

    @Get('/quizes/:quizId/questions')
    async getAllQuestionsOfQuiz(@Param('quizId') quizId) {
        return await this.coursesService.getAllQuestionsOfAQuiz(quizId);
    }

    @Post('/questions/:questionId/questionOptions')
    async addOptionToQuestion(@Param("questionId") questionId, @Body() {questionOption}) {
        return await this.coursesService.addOptionToQuestion(questionId, questionOption);
    }

}

interface NewCourseData {
    courseName: string;
}

interface NewQuizData {
    courseId: number,
    quizName: string
}