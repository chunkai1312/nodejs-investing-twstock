import { Module, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { LineNotifyModule } from 'nest-line-notify';
import { DateTime } from 'luxon';
import { ScraperModule } from './scraper/scraper.module';
import { MarketStatsModule } from './market-stats/market-stats.module';
import { TickerModule } from './ticker/ticker.module';
import { MarketStatsService } from './market-stats/market-stats.service';
import { TickerService } from './ticker/ticker.service';
import { ReportModule } from './report/report.module';
import { ScreenerModule } from './screener/screener.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MailerModule.forRoot({
      transport: {
        service: process.env.NODEMAILER_SERVICE,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      },
      defaults: {
        from: process.env.NODEMAILER_FROM,
        to: process.env.NODEMAILER_TO,
      },
    }),
    LineNotifyModule.forRoot({
      accessToken: process.env.LINE_NOTIFY_ACCESS_TOKEN,
    }),
    ScraperModule,
    MarketStatsModule,
    TickerModule,
    ReportModule,
    ScreenerModule,
  ]
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly marketStatsService: MarketStatsService,
    private readonly tickerService: TickerService
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SCRAPER_INIT_ENABLED === 'true') {
      Logger.log('正在初始化應用程式...', AppModule.name);

      const days = parseInt(process.env.SCRAPER_INIT_DAYS, 10) || 30;
      const startDate = DateTime.local().minus({ days });
      const endDate = DateTime.local();

      for (let dt = startDate; dt <= endDate; dt = dt.plus({ day: 1 })) {
        await this.marketStatsService.updateMarketStats(dt.toISODate());
        await this.tickerService.updateTickers(dt.toISODate());
      }

      Logger.log('應用程式初始化完成', AppModule.name);
    }
  }
}
