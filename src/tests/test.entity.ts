import {Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.ownedQuizzes)
    owner: User;

    @Column()
    showResultAtTheEnd: boolean;
}