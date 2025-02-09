import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { FugleMarketDataModule } from '@fugle/marketdata-nest';
import { FugleTradeModule } from '@fugle/trade-nest';
import { IpFilter } from 'nestjs-ip-filter';
import { Notifier, NotifierModule } from '@app/core/notifier';
import { TraderModule } from './trader/trader.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    FugleMarketDataModule.forRoot({
      apiKey: process.env.FUGLE_MARKETDATA_API_KEY,
    }),
    FugleTradeModule.forRoot({
      config: {
        apiUrl: process.env.FUGLE_TRADE_API_URL,
        certPath: process.env.FUGLE_TRADE_CERT_PATH,
        apiKey: process.env.FUGLE_TRADE_API_KEY,
        apiSecret: process.env.FUGLE_TRADE_API_SECRET,
        aid: process.env.FUGLE_TRADE_AID,
        password: process.env.FUGLE_TRADE_PASSWORD,
        certPass: process.env.FUGLE_TRADE_CERT_PASS,
      },
    }),
    IpFilter.register({
      whitelist: String(process.env.ALLOWED_IPS).split(','),
    }),
    TraderModule,
    PlanModule,
  ],
})
export class AppModule {
  static register(options: { notifier: Notifier }) {
    return {
      module: AppModule,
      imports: [NotifierModule.use(options.notifier)],
    };
  }
}
