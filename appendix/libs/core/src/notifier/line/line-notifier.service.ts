import * as line from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { InjectLineMessagingApiClient } from 'nest-line-bot';
import { NotifierService } from '../notifier.service';

@Injectable()
export class LineNotifierService implements NotifierService {
  constructor(
    @InjectLineMessagingApiClient() private readonly line: line.messagingApi.MessagingApiClient,
  ) {}

  async send(message: string) {
    return this.line.pushMessage({
      to: process.env.LINE_USER_ID,
      messages: [{ type: 'text', text: message }],
    });
  }
}
