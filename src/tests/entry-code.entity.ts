import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne, OneToOne } from 'typeorm';
import { Test } from './test.entity';
import { TestSession } from '../test-session/TestSession.entity';

export enum EntryCodeStatus {
    NOT_ACCESSED = "Not accessed",
    IN_PROGRESS = "In progress",
    ABANDONED = "Abandoned",
    DONE = "Done"
}

@Entity()
export class EntryCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: EntryCodeStatus,
        default: EntryCodeStatus.NOT_ACCESSED
    })
    status: EntryCodeStatus;

    @ManyToOne(type => Test, test => test.entryCodes, { onDelete: 'CASCADE' })
    test: Test;

    @OneToOne(type => TestSession, testSession => testSession.entryCode)
    entryCode: EntryCode;
}
