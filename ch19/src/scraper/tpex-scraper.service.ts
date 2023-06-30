import * as _ from 'lodash';
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

  async fetchMarketBreadth(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return {
      date,
      up: numeral(json.upNum).value(),
      limitUp: numeral(json.upStopNum).value(),
      down: numeral(json.downNum).value(),
      limitDown: numeral(json.downStopNum).value(),
      unchanged: numeral(json.noChangeNum).value(),
      unmatched: numeral(json.noTradeNum).value(),
    };
  }

  async fetchInstInvestorsTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      t: 'D',
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData
      .map(row => row.slice(1)).flat()
      .map(row => numeral(row).value());

    return {
      date,
      finiNetBuySell: data[2],
      sitcNetBuySell: data[11],
      dealersBuySell: data[14],
    };
  }

  async fetchMarginTransactions(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = [...json.tfootData_one, ...json.tfootData_two]
      .map(row => numeral(row).value())
      .filter(row => row);

    return {
      date,
      marginBalance: data[4],
      marginBalanceChange: data[4] - data[0],
      marginBalanceValue: data[14],
      marginBalanceValueChange: data[14] - data[10],
      shortBalance: data[9],
      shortBalanceChange: data[9] - data[5],
    };
  }

  async fetchIndicesQuotes(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const indices = [
      { symbol: 'IX0044', name: '櫃檯紡纖類指數' },
      { symbol: 'IX0045', name: '櫃檯機械類指數' },
      { symbol: 'IX0046', name: '櫃檯鋼鐵類指數' },
      { symbol: 'IX0048', name: '櫃檯營建類指數' },
      { symbol: 'IX0049', name: '櫃檯航運類指數' },
      { symbol: 'IX0050', name: '櫃檯觀光類指數' },
      { symbol: 'IX0100', name: '櫃檯其他類指數' },
      { symbol: 'IX0051', name: '櫃檯化工類指數' },
      { symbol: 'IX0052', name: '櫃檯生技醫療類指數' },
      { symbol: 'IX0053', name: '櫃檯半導體類指數' },
      { symbol: 'IX0054', name: '櫃檯電腦及週邊類指數' },
      { symbol: 'IX0055', name: '櫃檯光電業類指數' },
      { symbol: 'IX0056', name: '櫃檯通信網路類指數' },
      { symbol: 'IX0057', name: '櫃檯電子零組件類指數' },
      { symbol: 'IX0058', name: '櫃檯電子通路類指數' },
      { symbol: 'IX0059', name: '櫃檯資訊服務類指數' },
      { symbol: 'IX0099', name: '櫃檯其他電子類指數' },
      { symbol: 'IX0075', name: '櫃檯文化創意業類指數' },
      { symbol: 'IX0047', name: '櫃檯電子類指數' },
      { symbol: 'IX0043', name: '櫃檯指數' },
    ];

    const quotes = json.aaData.flatMap(row => {
      const [time, ...values] = row;
      return values.slice(0, -7).map((value, i) => ({
        date,
        time,
        symbol: indices[i].symbol,
        name: indices[i].name,
        price: numeral(value).value(),
      }));
    });

    return _(quotes).groupBy('symbol')
      .map(quotes => {
        const [prev, ...rows] = quotes;
        const { date, symbol, name } = prev;
        const data: Record<string, any> = { date, symbol, name};
        data.openPrice = _.minBy(rows, 'time').price;
        data.highPrice = _.maxBy(rows, 'price').price;
        data.lowPrice = _.minBy(rows, 'price').price;
        data.closePrice = _.maxBy(rows, 'time').price;
        data.change = numeral(data.closePrice).subtract(prev.price).value();
        data.changePercent = +numeral(data.change).divide(prev.price).multiply(100).format('0.00');
        return data;
      }).value();
  }
}
