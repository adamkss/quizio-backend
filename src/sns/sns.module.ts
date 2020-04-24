import { Module, HttpModule } from '@nestjs/common';
import { SNSController } from './sns.controller';
import { SNSService } from './sns.service';

@Module({
    imports: [HttpModule],
    providers: [SNSService],
    controllers: [SNSController],
    exports: [SNSService]
})
export class SNSModule { }
