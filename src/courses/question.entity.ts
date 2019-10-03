import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, OneToOne} from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuestionOption } from './questionOption.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @OneToMany(type => QuestionOption, questionOption => questionOption.question, {eager: true})
    questionOptions: QuestionOption[];

    @ManyToOne(type => Quiz, quiz => quiz.questions)
    quiz: Quiz;
}