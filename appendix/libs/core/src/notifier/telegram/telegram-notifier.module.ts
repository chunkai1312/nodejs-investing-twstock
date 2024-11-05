import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramNotifierService } from './telegram-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: TelegramNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class TelegramNotifierModule {}
