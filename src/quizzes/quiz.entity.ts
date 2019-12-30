import {Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne} from 'typeorm';
import { Question } from '../questions/question.entity';
import { Course } from '../courses/course.entity';
import { User } from 'src/users/user.entity';
import { QuizSession } from 'src/quiz_session/QuizSesssion.entity';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Course, course => course.quizes)
    course: Course;

    @OneToMany(type => Question, question => question.quiz, {eager: false})
    questions: Promise<Question[]>;

    @ManyToOne(type => User, user => user.ownedQuizzes)
    owner: User;

    @Column()
    askForQuizTakerName: boolean;

    @Column()
    showResultAtTheEnd: boolean;

    @OneToMany(type => QuizSession, quizSession => quizSession.quiz) 
    finishedQuizSessions: Promise<QuizSession[]>; 
}