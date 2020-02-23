import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { UsersModule } from 'src/users/users.module';
import { TestQuestion } from './test-question.entity';
import { TestQuestionOption } from './test-question-option.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Test, TestQuestion, TestQuestionOption]),
        UsersModule
    ],
    providers: [TestsService],
    controllers: [TestsController]
})
export class TestsModule { }
