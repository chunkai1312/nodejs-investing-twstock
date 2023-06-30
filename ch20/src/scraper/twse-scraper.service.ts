import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class TwseScraperService {
  constructor(private httpService: HttpService) {}

  async fetchListedStocks(options?: { market: 'TSE' | 'OTC' }) {
    const market = options?.market ?? 'TSE';
    const url = {
      'TSE': 'https://isin.twse.com.tw/isin/class_main.jsp?market=1&issuetype=1',
      'OTC': 'https://isin.twse.com.tw/isin/class_main.jsp?market=2&issuetype=4',
    };
    const response = await firstValueFrom(
      this.httpService.get(url[market], { responseType: 'arraybuffer' })
    );
    const page = iconv.decode(response.data, 'big5');
    const $ = cheerio.load(page);

    return $('.h4 tr').slice(1).map((_, el) => {
      const td = $(el).find('td');
      return {
        symbol: td.eq(2).text().trim(),
        name: td.eq(3).text().trim(),
        market: td.eq(4).text().trim(),
        industry: td.eq(6).text().trim(),
      };
    }).toArray();
  }

  async fetchMarketTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.data.map(row => {
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
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const raw = json.tables[7].data.map(row => row[2]);
    const [up, limitUp] = raw[0].replace(')', '').split('(');
    const [down, limitDown] = raw[1].replace(')', '').split('(');
    const [unchanged, unmatched, notApplicable] = raw.slice(2);

    return {
      date,
      up: numeral(up).value(),
      limitUp: numeral(limitUp).value(),
      down: numeral(down).value(),
      limitDown: numeral(limitDown).value(),
      unchanged: numeral(unchanged).value(),
      unmatched: numeral(unmatched).value() + numeral(notApplicable).value(),
    };
  }

  async fetchInstInvestorsTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      dayDate: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'day',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/fund/BFI82U?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.data
      .map(row => row.slice(1)).flat()
      .map(row => numeral(row).value());

    return {
      date,
      finiNetBuySell: data[11] + data[14],
      sitcNetBuySell: data[8],
      dealersNetBuySell: data[2] + data[5],
    };
  }

  async fetchMarginTransactions(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'MS',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.tables[0].data
      .map(data => data.slice(1)).flat()
      .map(data => numeral(data).value());

    return {
      date,
      marginBalance: data[4],
      marginBalanceChange: data[4] - data[3],
      marginBalanceValue: data[14],
      marginBalanceValueChange: data[14] - data[13],
      shortBalance: data[9],
      shortBalanceChange: data[9] - data[8],
    };
  }

  async fetchIndicesQuotes(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const indices = [
      { symbol: 'IX0001', name: '發行量加權股價指數' },
      { symbol: 'IX0007', name: '未含金融保險股指數' },
      { symbol: 'IX0008', name: '未含電子股指數'  },
      { symbol: 'IX0009', name: '未含金融電子股指數' },
      { symbol: 'IX0010', name: '水泥類指數' },
      { symbol: 'IX0011', name: '食品類指數' },
      { symbol: 'IX0012', name: '塑膠類指數' },
      { symbol: 'IX0016', name: '紡織纖維類指數' },
      { symbol: 'IX0017', name: '電機機械類指數' },
      { symbol: 'IX0018', name: '電器電纜類指數' },
      { symbol: 'IX0019', name: '化學生技醫療類指數' },
      { symbol: 'IX0020', name: '化學類指數' },
      { symbol: 'IX0021', name: '生技醫療類指數' },
      { symbol: 'IX0022', name: '玻璃陶瓷類指數' },
      { symbol: 'IX0023', name: '造紙類指數' },
      { symbol: 'IX0024', name: '鋼鐵類指數' },
      { symbol: 'IX0025', name: '橡膠類指數' },
      { symbol: 'IX0026', name: '汽車類指數' },
      { symbol: 'IX0027', name: '電子工業類指數' },
      { symbol: 'IX0028', name: '半導體類指數' },
      { symbol: 'IX0029', name: '電腦及週邊設備類指數' },
      { symbol: 'IX0030', name: '光電類指數' },
      { symbol: 'IX0031', name: '通信網路類指數' },
      { symbol: 'IX0032', name: '電子零組件類指數' },
      { symbol: 'IX0033', name: '電子通路類指數' },
      { symbol: 'IX0034', name: '資訊服務類指數' },
      { symbol: 'IX0035', name: '其他電子類指數' },
      { symbol: 'IX0036', name: '建材營造類指數' },
      { symbol: 'IX0037', name: '航運類指數' },
      { symbol: 'IX0038', name: '觀光類指數' },
      { symbol: 'IX0039', name: '金融保險類指數' },
      { symbol: 'IX0040', name: '貿易百貨類指數' },
      { symbol: 'IX0041', name: '油電燃氣類指數' },
      { symbol: 'IX0042', name: '其他類指數' },
    ];

    const quotes = json.data.flatMap(row => {
      const [time, ...values] = row;
      return values.map((value, i) => ({
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

  async fetchIndicesTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?${query}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const market = await this.fetchMarketTrades({ date });
    if (!market) return null;

    const indices = [
      { symbol: 'IX0010', name: '水泥類指數' },
      { symbol: 'IX0011', name: '食品類指數' },
      { symbol: 'IX0012', name: '塑膠類指數' },
      { symbol: 'IX0016', name: '紡織纖維類指數' },
      { symbol: 'IX0017', name: '電機機械類指數' },
      { symbol: 'IX0018', name: '電器電纜類指數' },
      { symbol: 'IX0019', name: '化學生技醫療類指數' },
      { symbol: 'IX0020', name: '化學類指數' },
      { symbol: 'IX0021', name: '玻璃陶瓷類指數' },
      { symbol: 'IX0022', name: '玻璃陶瓷類指數' },
      { symbol: 'IX0023', name: '造紙類指數' },
      { symbol: 'IX0024', name: '鋼鐵類指數' },
      { symbol: 'IX0025', name: '橡膠類指數' },
      { symbol: 'IX0026', name: '汽車類指數' },
      { symbol: 'IX0027', name: '電子工業類指數' },
      { symbol: 'IX0028', name: '半導體類指數' },
      { symbol: 'IX0029', name: '電腦及週邊設備類指數' },
      { symbol: 'IX0030', name: '光電類指數' },
      { symbol: 'IX0031', name: '通信網路類指數' },
      { symbol: 'IX0032', name: '電子零組件類指數' },
      { symbol: 'IX0033', name: '電子通路類指數' },
      { symbol: 'IX0034', name: '資訊服務類指數' },
      { symbol: 'IX0035', name: '其他電子類指數' },
      { symbol: 'IX0036', name: '建材營造類指數' },
      { symbol: 'IX0037', name: '航運類指數' },
      { symbol: 'IX0038', name: '觀光事業類指數' },
      { symbol: 'IX0039', name: '金融保險類指數' },
      { symbol: 'IX0040', name: '貿易百貨類指數' },
      { symbol: 'IX0041', name: '油電燃氣類指數' },
      { symbol: 'IX0042', name: '其他類指數' },
    ];

    return json.data.map((row, i) => {
      const { symbol, name } = indices[i];
      const data: Record<string, any> = { date, symbol, name };
      data.tradeVolume = numeral(row[1]).value();
      data.tradeValue = numeral(row[2]).value();
      data.tradeWeight = +numeral(data.tradeValue).divide(market.tradeValue).multiply(100).format('0.00');
      return data;
    });
  }
}
