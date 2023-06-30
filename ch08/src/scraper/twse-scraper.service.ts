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
}
