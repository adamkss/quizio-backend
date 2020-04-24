import { Module, Global } from '@nestjs/common';
import { SQSService } from './sqs.service';

@Module({
    imports: [],
    providers: [SQSService],
    controllers: [],
    exports: [SQSService]
})
export class SQSModule { }
