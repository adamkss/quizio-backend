import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Test } from "../tests/test.entity";
import { EntryCode } from "../tests/entry-code.entity";
import { TestQuestion } from "src/tests/test-question.entity";
import { TestSession } from "./TestSession.entity";
import { TestQuestionOption } from "src/tests/test-question-option.entity";

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