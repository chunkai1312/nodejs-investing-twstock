import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketStats, MarketStatsDocument } from './market-stats.schema';

@Injectable()
export class MarketStatsRepository {
  constructor(
    @InjectModel(MarketStats.name) private readonly model: Model<MarketStatsDocument>,
  ) {}

  async updateMarketStats(marketStats: Partial<MarketStats>) {
    const { date } = marketStats;
    return this.model.updateOne({ date }, marketStats, { upsert: true });
  }
}
