import { Injectable } from "@nestjs/common";
import aws, { SQS } from 'aws-sdk';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SQSService {
    sqs: SQS;
    pdfsToExportQueueURL: string;

    constructor(
        private configService: ConfigService
    ) {
        aws.config.update({
            region: configService.get('SQS_AWSREGION')
        });
        this.sqs = new SQS();
        this.pdfsToExportQueueURL = configService.get('SQS_EXPORT_PDF_REQUEST_QUEUE');
    }

    async sendMessageToPDFsToExportQueue({ id, data, title = null }): Promise<boolean> {
        return new Promise((res, rej) => {
            let options: any = {
                MessageBody: JSON.stringify({ id, data }),
                QueueUrl: this.pdfsToExportQueueURL
            };
            if (title) {
                options = {
                    ...options,
                    MessageAttributes: {
                        Title: {
                            DataType: "String",
                            StringValue: title
                        }
                    }
                }
            }

            this.sqs.sendMessage(options, (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    res(true);
                }
            })
        })
    }
}