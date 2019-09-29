import { Injectable } from '@nestjs/common';
import { User } from './entities/User/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }
}
