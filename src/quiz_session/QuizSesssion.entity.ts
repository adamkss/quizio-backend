import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}