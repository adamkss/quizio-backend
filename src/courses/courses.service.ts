import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course) private readonly coursesRepository: Repository<Course>,
        private readonly quizzesService: QuizzesService,
    ) { }

    getAllCourses(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    getCourseById(id: number): Promise<Course> {
        return this.coursesRepository.findOne(id);
    }

    createCourse({ courseName }) {
        const course = new Course();
        course.courseName = courseName;

        return this.coursesRepository.save(course);
    }

    async createQuiz(courseId, quizName): Promise<Quiz> {
        const course: Course = await this.getCourseById(courseId);
        return this.quizzesService.createQuiz(quizName, course);
    }

    async getAllQuizesOfCourse(courseId) {
        const course = await this.getCourseById(courseId);
        const quizes = await course.quizes;
        return quizes;
    }
}
