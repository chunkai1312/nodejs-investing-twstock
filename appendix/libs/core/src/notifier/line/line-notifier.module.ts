import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LineBotModule } from 'nest-line-bot';
import { LineNotifierService } from './line-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    LineBotModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        channelAccessToken: configService.get('LINE_CHANNEL_ACCESS_TOKEN'),
        channelSecret: configService.get('LINE_CHANNEL_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: LineNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class LineNotifierModule {}
