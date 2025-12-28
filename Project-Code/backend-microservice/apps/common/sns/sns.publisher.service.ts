import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnsPublisherService {
    private snsClient: SNSClient;
    private topicArn: string;
    constructor(private configService: ConfigService) {
        this.snsClient = new SNSClient({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || "",
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || "",
            },
        });
        this.topicArn = this.configService.get('SNS_TOPIC_ARN') || "";
    }

    async publishMessage(serviceName: string, eventType: string, message: string) {
        try {
            const command = new PublishCommand({
                TopicArn: this.topicArn,
                Message: message,
                MessageAttributes: {
                    service: {
                        DataType: 'String',
                        StringValue: serviceName,
                    },
                    eventType: {
                        DataType: 'String',
                        StringValue: eventType,
                    },
                },
            });
            const response = await this.snsClient.send(command);
            console.log(`SNS message sent for the service <${serviceName}> the event type is <${eventType}> and the message is ${message}`);
            return response;
        } catch (error) {
            console.log('Error', error);
        }
    }
}