import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketStats, MarketStatsSchema } from './market-stats.schema';
import { MarketStatsRepository } from './market-stats.repository';
import { ScraperModule } from '../scraper/scraper.module';
import { MarketStatsService } from './market-stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketStats.name, schema: MarketStatsSchema },
    ]),
    ScraperModule,
  ],
  providers: [MarketStatsRepository, MarketStatsService],
  exports: [MarketStatsRepository, MarketStatsService],
})
export class MarketStatsModule {}
