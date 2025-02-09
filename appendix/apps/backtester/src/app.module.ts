import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FugleMarketDataModule } from '@fugle/marketdata-nest';
import { BacktesterModule } from './backtester/backtester.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FugleMarketDataModule.forRoot({
      apiKey: process.env.FUGLE_MARKETDATA_API_KEY,
    }),
    BacktesterModule,
  ],
})
export class AppModule {}
