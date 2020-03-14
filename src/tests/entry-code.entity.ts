import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne } from 'typeorm';
import { Test } from './test.entity';

@Entity()
export class EntryCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @ManyToOne(type => Test, test => test.entryCodes, { onDelete: 'CASCADE' })
    test: Test;
}