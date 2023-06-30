import * as numeral from 'numeral';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class TpexScraperService {
  constructor(private httpService: HttpService) {}

  async fetchMarketTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return json.aaData.map(row => {
      const [year, month, day] = row[0].split('/');
      return {
        date: `${+year + 1911}-${month}-${day}`,
        tradeVolume: numeral(row[1]).value(),
        tradeValue: numeral(row[2]).value(),
        transaction: numeral(row[3]).value(),
        price: numeral(row[4]).value(),
        change: numeral(row[5]).value(),
      };
    }).find(data => data.date === date);
  }
}
