import { default as yahooFinance } from 'yahoo-finance2';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class YahooFinanceService {

  async fetchUsStockMarketIndices(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const symbols = ['^DJI', '^GSPC', '^IXIC', '^SOX'];

    try {
      const data = await Promise.all(symbols.map(async symbol => {
        const results = await yahooFinance.historical(symbol, {
          period1: date,
          period2: DateTime.fromISO(date).plus({ day: 1 }).toISODate(),
        });
        return results.map(({ date, ...data }) => ({
          date: DateTime.fromJSDate(date).toISODate(),
          symbol,
          ...data,
        })).find(data => data.date === date) ?? null;
      }));
      return data.filter(data => data);
    } catch (err) {
      return null;
    }
  }
}
