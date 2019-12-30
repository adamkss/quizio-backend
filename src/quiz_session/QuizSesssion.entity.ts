import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Quiz } from "src/quizzes/quiz.entity";

@Entity()
export class QuizSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quizTakerName: string;

    @Column()
    result: number;

    @Column()
    date: string;

    @ManyToOne(type => Quiz, quiz => quiz.finishedQuizSessions)
    quiz: Quiz;
}