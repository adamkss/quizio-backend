import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Quiz } from "./quiz.entity";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courseName: string;

    @OneToMany(type => Quiz, quiz => quiz.course, {eager: false})
    quizes: Promise<Quiz[]>;
}