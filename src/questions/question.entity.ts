import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { QuestionOption } from '../question-options/questionOption.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @OneToMany(type => QuestionOption, questionOption => questionOption.question, { eager: true })
    questionOptions: QuestionOption[];

    @ManyToOne(type => Quiz, quiz => quiz.questions)
    quiz: Quiz;
}