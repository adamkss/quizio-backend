import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Quiz } from "../quizzes/quiz.entity";
import { Test } from "../tests/test.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;
    
    @Column()
    passwordHash: string;

    @OneToMany(type => Quiz, quiz => quiz.owner)
    ownedQuizzes: Promise<Quiz[]>;

    @OneToMany(type => Test, test => test.owner)
    ownedTests: Promise<Test[]>;
}