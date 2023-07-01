import { Module } from '@nestjs/common';
import { BacktesterService } from './backtester.service';
import { BacktesterCommand } from './backtester.command';

@Module({
  providers: [BacktesterService, BacktesterCommand]
})
export class BacktesterModule {}
