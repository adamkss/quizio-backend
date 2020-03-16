import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { TestQuestion } from './test-question.entity';
import { EntryCode } from './entry-code.entity';
import { TestSession } from '../test-session/TestSession.entity';

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.ownedQuizzes)
    owner: User;

    @Column()
    numberOfQuestions: number;

    @Column()
    showResultAtTheEnd: boolean;

    @OneToMany(type => TestQuestion, testQuestion => testQuestion.test)
    questions: Promise<TestQuestion[]>;

    @OneToMany(type => EntryCode, entryCode => entryCode.test)
    entryCodes: Promise<EntryCode[]>;

    @OneToMany(type => TestSession, session => session.test)
    testSessions: Promise<EntryCode[]>;
}