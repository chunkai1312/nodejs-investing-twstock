import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
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

  async getMarketStats(options?: { days?: number, date?: string }) {
    const date = options?.date || DateTime.local().toISODate();
    const days = options?.days || 30;

    const results: MarketStats[] = await this.model.aggregate([
      { $match: { date: { $lte: date } } },
      { $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } },
      { $sort: { date: -1 } },
      { $limit: days + 1 },
    ]);

    return results.map((doc, i) => {
      const next = results[i + 1];
      const hasProperty = (property: string) => doc[property] && results[i + 1]?.[property];
      const data = doc as Record<string, any>;
      data.taiexChangePercent = hasProperty('taiexPrice')
        && Math.round((doc.taiexChange / (doc.taiexPrice - doc.taiexChange)) * 10000) / 100;
      data.finiTxfNetOiChange = hasProperty('finiTxfNetOi')
        && doc.finiTxfNetOi - next.finiTxfNetOi;
      data.finiTxoCallsNetOiValueChange = hasProperty('finiTxoCallsNetOiValue')
        && doc.finiTxoCallsNetOiValue - next.finiTxoCallsNetOiValue;
      data.finiTxoPutsNetOiValueChange = hasProperty('finiTxoPutsNetOiValue')
        && doc.finiTxoPutsNetOiValue - next.finiTxoPutsNetOiValue;
      data.topTenSpecificFrontMonthTxfNetOiChange = hasProperty('topTenSpecificFrontMonthTxfNetOi')
        && doc.topTenSpecificFrontMonthTxfNetOi - next.topTenSpecificFrontMonthTxfNetOi;
      data.topTenSpecificBackMonthsTxfNetOiChange = hasProperty('topTenSpecificBackMonthsTxfNetOi')
        && doc.topTenSpecificBackMonthsTxfNetOi - next.topTenSpecificBackMonthsTxfNetOi;
      data.retailMxfNetOiChange = hasProperty('retailMxfNetOi')
        && doc.retailMxfNetOi - next.retailMxfNetOi;
      data.usdtwdChange = hasProperty('usdtwd')
        && parseFloat((doc.usdtwd - next.usdtwd).toPrecision(12));
      return data;
    }).slice(0, -1);
  }
}
