import {Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne} from 'typeorm';
import { Question } from './question.entity';
import { Course } from './course.entity';

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
}