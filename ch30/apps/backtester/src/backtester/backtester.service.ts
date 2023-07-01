import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { InjectRestClient } from '@fugle/marketdata-nest';
import { RestClient } from '@fugle/marketdata';
import { Backtest, BacktestOptions, HistoricalData } from '@fugle/backtest';
import { StrategyFactory } from './strategies/strategy-factory';

@Injectable()
export class BacktesterService {
  constructor(@InjectRestClient() private readonly client: RestClient) {}

  async getHistoricalData(symbol: string, startDate: string, endDate: string) {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const data = [];

    for (let dt = start; dt.startOf('year') <= end; dt = dt.plus({ year: 1 })) {
      const from = (dt.year === start.year) ? start.toISODate() : dt.startOf('year').toISODate();
      const to = (dt.year === end.year) ? end.toISODate() : dt.endOf('year').toISODate();
      const candles = await this.client.stock.historical.candles({ symbol, from, to });
      data.push(...candles.data);
    }

    return data;
  }

  async runBacktest(data: HistoricalData, strategy: string, options?: BacktestOptions) {
    const Strategy = StrategyFactory.create(strategy);
    const backtest = new Backtest(data, Strategy, options);
    const results = await backtest.run();
    results.print();
    results.plot();
  }
}
