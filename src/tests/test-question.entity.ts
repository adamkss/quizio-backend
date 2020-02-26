import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Test } from "./test.entity";
import { TestQuestionOption } from "./test-question-option.entity";

@Entity()
export class TestQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionTitle: string;

    @Column()
    questionOrderNumber: number;

    @ManyToOne(type => Test, test => test.questions)
    test: Test;

    @OneToMany(type => TestQuestionOption, testQuestionOption => testQuestionOption.testQuestion)
    questionOptions: Promise<TestQuestionOption[]>;
}