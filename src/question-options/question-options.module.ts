import { Module } from '@nestjs/common';
import { QuestionOptionsService } from './question-options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOption } from './questionOption.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionOption])
  ],
  providers: [QuestionOptionsService],
  controllers: [],
  exports: [QuestionOptionsService]
})
export class QuestionOptionsModule { }
