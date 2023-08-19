import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateTime } from 'luxon';
import { Ticker, TickerDocument } from './ticker.schema';
import { TickerType, Market, Index } from './enums';

@Injectable()
export class TickerRepository {
  constructor(
    @InjectModel(Ticker.name) private readonly model: Model<TickerDocument>,
  ) {}

  async updateTicker(ticker: Partial<Ticker>) {
    const { date, symbol } = ticker;
    return this.model.updateOne({ date, symbol }, ticker, { upsert: true });
  }

  async getMoneyFlow(options?: { date?: string, market?: Market }) {
    const date = options?.date || DateTime.local().toISODate();
    const market = options?.market || Market.TSE;

    const results = await this.model.aggregate([
      { $match: {
          date: { $lte: date },
          type: TickerType.Index,
          market: market || { $ne: null },
          symbol: { $nin: [Index.NonElectronics, Index.NonFinance, Index.NonFinanceNonElectronics] },
        },
      },
      { $project: { _id: 0, __v: 0, createdAt: 0 , updatedAt: 0 } },
      { $group: { _id: '$date', data: { $push: '$$ROOT' } } },
      { $sort: { _id: -1 } },
      { $limit: 2 },
    ]);

    const [ tickers, tickersPrev ] = results.map(doc => doc.data);

    return tickers.map(doc => {
      const data = doc as Record<string, any>;
      data.tradeValuePrev = _.find(tickersPrev, { symbol: doc.symbol }).tradeValue;
      data.tradeWeightPrev = _.find(tickersPrev, { symbol: doc.symbol }).tradeWeight;
      data.tradeValueChange = doc.tradeValue - data.tradeValuePrev;
      data.tradeWeightChange = parseFloat((doc.tradeWeight - data.tradeWeightPrev).toPrecision(12));
      return data;
    });
  }

  async getTopMovers(options?: { date?: string, market?: Market, direction?: 'up' | 'down', top?: number }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const market = options?.market ?? Market.TSE;
    const direction = options?.direction ?? 'up';
    const top = options?.top ?? 50;

    const results = await this.model.aggregate([
      { $match: {
          date: { $lte: date },
          type: TickerType.Equity,
          market: market ?? { $ne: null },
          changePercent: (direction === 'down') ? { $lt: 0 } : { $gt: 0 },
        },
      },
      { $project: { _id: 0, __v: 0, createdAt: 0 , updatedAt: 0 } },
      { $sort: { date: -1, changePercent: (direction === 'down') ? 1 : -1 } },
      { $group: { _id: '$date', data: { $push: '$$ROOT' } } },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ], { allowDiskUse: true });

    const [ tickers ] = results.map(doc => doc.data);
    return tickers.slice(0, top);
  }

  async getMostActives(options?: { date?: string, market?: Market, trade?: 'volume' | 'value', top?: number }) {
    const date = options?.date || DateTime.local().toISODate();
    const market = options?.market || Market.TSE;
    const trade = options?.trade || 'volume';
    const tradeKey = (trade === 'value') ? 'tradeValue' : 'tradeVolume';
    const top = options?.top || 50;

    const results = await this.model.aggregate([
      { $match: {
          date: { $lte: date },
          type: TickerType.Equity,
          market: market || { $ne: null },
        },
      },
      { $project: { _id: 0, __v: 0, createdAt: 0 , updatedAt: 0 } },
      { $sort: { date: -1, [tradeKey]: -1 } },
      { $group: { _id: '$date', data: { $push: '$$ROOT' } } },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ], { allowDiskUse: true });

    const [ tickers ] = results.map(doc => doc.data);
    return tickers.slice(0, top);
  }

  async getInstInvestorsTrades(options?: { date?: string, market?: Market, inst?: 'fini' | 'sitc' | 'dealers', net: 'buy' | 'sell', top?: number }) {
    const date = options?.date || DateTime.local().toISODate();
    const market = options?.market || Market.TSE;
    const inst = options?.inst || `fini`;
    const net = options?.net || 'buy';
    const top = options?.top || 50;
    const instKey = `${inst}NetBuySell`;

    const results = await this.model.aggregate([
      { $match: {
          date: { $lte: date },
          type: TickerType.Equity,
          market: market || { $ne: null },
          [instKey]: (net === 'sell') ? { $lt: 0 } : { $gt: 0 },
        },
      },
      { $project: { _id: 0, __v: 0, createdAt: 0 , updatedAt: 0 } },
      { $sort: { date: -1, [instKey]: (net === 'sell') ? 1 : -1 } },
      { $group: { _id: '$date', data: { $push: '$$ROOT' } } },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ], { allowDiskUse: true });

    const [ tickers ] = results.map(doc => doc.data);
    return tickers.slice(0, top);
  }
}
