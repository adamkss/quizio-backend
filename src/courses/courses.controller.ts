import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, Res } from '@nestjs/common';
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

    @Post('/:courseId/quizzes')
    async createQuiz(@Param('courseId') courseId, @Body() {quizName}: NewQuizData) {
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

    @Put('/questions/:questionId/rightAnswer')
    async updateRightAnswerToQuestion(@Param("questionId") questionId, @Body() {newCorrectQuestionOptionId}) {
        return await this.coursesService.setNewRightAnswerToQuestion(questionId, newCorrectQuestionOptionId);
    }

    @Delete('/questions/:questionId/questionOptions/:questionOptionId')
    async deleteQuestionOptionFromQuestion(@Param("questionId") questionId, @Param("questionOptionId") questionOptionId) {
        return await this.coursesService.deleteAnswerFromQuestion(questionId, questionOptionId);
    }

    @Delete('/questions/:questionId')
    @HttpCode(204)
    async deleteQuestion (@Param('questionId') questionId) {
        await this.coursesService.deleteQuestion(questionId);
    }

    @Delete('/:courseId/quizzes/:quizId')
    async deleteQuiz(@Param('courseId') courseId, @Param('quizId') quizId, @Res() response) {
        const wasDeletedSuccessfully = await this.coursesService.deleteQuiz(courseId, quizId);
        wasDeletedSuccessfully ? response.status(204).end() : response.status(404).end();
    }
}

interface NewCourseData {
    courseName: string;
}

interface NewQuizData {
    courseId: number,
    quizName: string
}