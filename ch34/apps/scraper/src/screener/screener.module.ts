import { Module } from '@nestjs/common';
import { TickerModule } from '../ticker/ticker.module';
import { ScreenerService } from './screener.service';

@Module({
  imports: [TickerModule],
  providers: [ScreenerService],
})
export class ScreenerModule {}
