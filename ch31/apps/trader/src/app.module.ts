import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FugleTradeModule } from '@fugle/trade-nest';
import { LineNotifyModule } from 'nest-line-notify';
import { IpFilter } from 'nestjs-ip-filter';
import { TraderModule } from './trader/trader.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    LineNotifyModule.forRoot({
      accessToken: process.env.LINE_NOTIFY_ACCESS_TOKEN,
    }),
    IpFilter.register({
      whitelist: String(process.env.ALLOWED_IPS).split(','),
    }),
    TraderModule,
  ],
})
export class AppModule {}
