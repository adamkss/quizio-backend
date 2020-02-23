import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TestQuestion } from "./test-question.entity";

@Entity()
export class TestQuestionOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionOptionText: string;

    @ManyToOne(type => TestQuestion, testQuestion => testQuestion.questionOptions)
    testQuestion: TestQuestion;

    @Column()
    amITheRightAnswer: boolean;
}