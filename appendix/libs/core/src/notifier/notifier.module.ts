import { Global, Module } from '@nestjs/common';
import { Notifier } from './notifier.enum';
import { LineNotifierModule } from './line/line-notifier.module';
import { TelegramNotifierModule } from './telegram/telegram-notifier.module';
import { DiscordNotifierModule } from './discord/discord-notifier.module';

@Global()
@Module({})
export class NotifierModule {
  static use(notifier: Notifier) {
    const modules = {
      [Notifier.Line]: LineNotifierModule,
      [Notifier.Telegram]: TelegramNotifierModule,
      [Notifier.Discord]: DiscordNotifierModule,
    };
    const notifierModule = modules[notifier];
    return {
      module: NotifierModule,
      imports: [notifierModule],
      exports: [notifierModule],
    };
  }
}
