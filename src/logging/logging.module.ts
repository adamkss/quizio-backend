import { Module, Global } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Global()
@Module({
    imports: [],
    providers: [LoggingService],
    controllers: [],
    exports: [LoggingService]
})
export class LoggingModule { }
