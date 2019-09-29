import { Injectable } from '@nestjs/common';
import { User } from './User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    insertUser(name: string): Promise<User> {
        const user = new User();
        user.name = name;

        return this.userRepository.save(user)
    }
}
