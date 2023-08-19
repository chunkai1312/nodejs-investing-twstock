import { Module } from '@nestjs/common';
import { TraderService } from './trader.service';
import { TraderController } from './trader.controller';

@Module({
  providers: [TraderService],
  controllers: [TraderController]
})
export class TraderModule {}
