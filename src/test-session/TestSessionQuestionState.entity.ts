import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { TestQuestion } from "../tests/test-question.entity";
import { TestSession } from "./TestSession.entity";
import { TestQuestionOption } from "../tests/test-question-option.entity";

@Entity()
export class TestSessionQuestionState {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TestQuestion)
    testQuestion: TestQuestion;

    @Column()
    testQuestionId: number;

    @ManyToOne(type => TestQuestionOption)
    testQuestionOptionSelected: TestQuestionOption;

    @Column()
    isAnswered: boolean;

    @ManyToOne(type => TestSession, testSession => testSession.testSessionQuestionStates)
    testSession: TestSession;
}