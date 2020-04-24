import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { UsersModule } from '../users/users.module';
import { TestQuestion } from './test-question.entity';
import { TestQuestionOption } from './test-question-option.entity';
import { EntryCode } from './entry-code.entity';
import { EntryCodesService } from './entry-codes.service';
import { ElasticSearchModule } from '../elasticsearch/elastic-search.module';
import { SQSModule } from 'src/sqs/sqs.module';
import { SNSModule } from 'src/sns/sns.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Test, TestQuestion, TestQuestionOption, EntryCode]),
        UsersModule,
        forwardRef(() => ElasticSearchModule),
        SQSModule,
        SNSModule
    ],
    providers: [TestsService, EntryCodesService],
    controllers: [TestsController],
    exports: [TestsService, EntryCodesService]
})
export class TestsModule { }
