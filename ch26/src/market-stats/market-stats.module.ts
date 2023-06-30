import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketStats, MarketStatsSchema } from './market-stats.schema';
import { MarketStatsRepository } from './market-stats.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketStats.name, schema: MarketStatsSchema },
    ]),
  ],
  providers: [MarketStatsRepository],
})
export class MarketStatsModule {}
