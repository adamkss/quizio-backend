import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.find({ where: { email: username } })[0];
  }

  async createNewUser(email: string, password: string): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.passwordHash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      })
    })
    return this.userRepository.save(newUser);
  }
}