import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Question } from "../questions/question.entity";

@Entity()
export class QuestionOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(type => Question, question => question.questionOptions)
    question: Question;

    @Column()
    amITheRightAnswer: boolean;
}