import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { NotifierService } from '../notifier.service';

@Injectable()
export class TelegramNotifierService implements NotifierService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async send(message: string) {
    return this.bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, message);
  }
}
