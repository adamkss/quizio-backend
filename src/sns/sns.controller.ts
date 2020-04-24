import { Controller, Post, Body, Req, HttpService } from "@nestjs/common";
import { Request } from 'express';
import { SNSService } from "./sns.service";

@Controller('sns')
export class SNSController {
    constructor(
        private readonly httpService: HttpService,
        private readonly snsService: SNSService
    ) { }

    @Post('/quizioPDFExportDone')
    async quizioPDFExportDone(@Body() body, @Req() req: Request) {
        const messageType = req.headers['x-amz-sns-message-type'];
        if (messageType == 'SubscriptionConfirmation') {
            const subscriberURL = body.SubscribeURL;
            this.httpService.get(subscriberURL).subscribe((response) => {
                console.log(response.status);
            })
        }
        if (messageType == "Notification") {
            this.snsService.onNewMessageFromPDFExportTopic(body.Message);
        }
    }
}   