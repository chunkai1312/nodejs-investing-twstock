import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import { DiscordNotifierService } from './discord-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('DISCORD_BOT_TOKEN'),
        intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: DiscordNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class DiscordNotifierModule {}
