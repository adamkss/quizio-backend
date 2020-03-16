import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { Test } from "../tests/test.entity";
import { EntryCode } from "../tests/entry-code.entity";
import { TestSessionQuestionState } from "./TestSessionQuestionState.entity";

@Entity()
export class TestSession {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    result: number;

    @Column()
    date: string;

    @ManyToOne(type => Test, test => test.testSessions)
    test: Test;

    @Column()
    wasAccessedByEntryCode: boolean;

    @OneToOne(type => EntryCode)
    @JoinColumn()
    entryCode: EntryCode;

    @OneToMany(type => TestSessionQuestionState, testSQT => testSQT.testSession)
    testSessionQuestionStates: Promise<TestSessionQuestionState[]>;
}