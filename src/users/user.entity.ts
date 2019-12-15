import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Quiz } from "src/quizzes/quiz.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @OneToMany(type => Quiz, quiz => quiz.owner)
    ownedQuizzes: Promise<Quiz[]>;
}