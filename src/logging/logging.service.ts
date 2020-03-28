import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createLogger, format, transports, Logger } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

@Injectable()
export class LoggingService {
    logger: Logger;

    constructor(
        private configService: ConfigService
    ) {
        this.logger = createLogger({
            format: format.json(),
            transports: [
                new transports.Console()
            ]
        });
        const cloudwatchConfig = {
            logGroupName: configService.get('LOGGING_LOGGROUPNAME'),
            logStreamName: configService.get('LOGGING_LOGSTREAMNAME'),
            awsAccessKeyId: configService.get('LOGGING_AWSACCESSKEYID'),
            awsSecretKey: configService.get('LOGGING_AWSSECRETKEY'),
            awsRegion: configService.get('LOGGING_AWSREGION'),
            messageFormatter: (logObject) => `[${logObject.level}]: ${logObject.message}.\n Additional Info: ${JSON.stringify(logObject.additionalInfo)}}`
        }
        this.logger.add(new WinstonCloudWatch(cloudwatchConfig))
    }

    log({ level = 'info', message = 'No message.', additionalInfo = null }) {
        this.logger.log(level, message, additionalInfo);
    }

    info(message: string) {
        this.log({ message });
    }
}