import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

type Market = 'sii' | 'otc' | 'rotc' | 'pub';

@Injectable()
export class MopsScraperService {
  constructor(private httpService: HttpService) { }

  async fetchQuarterlyEps(options: { market: Market, year: number, quarter: number }) {
    const { market, year, quarter } = options;
    const form = new URLSearchParams({
      encodeURIComponent: '1',
      step: '1',
      firstin: '1',
      off: '1',
      isQuery: 'Y',
      TYPEK: market,
      year: numeral(year).subtract(1911).format(),
      season: numeral(quarter).format('00'),
    });
    const url = 'https://mops.twse.com.tw/mops/web/t163sb04';
    const response = await firstValueFrom(this.httpService.post(url, form));
    const $ = cheerio.load(response.data);

    const data = $('.even,.odd').map((_, el) => {
      const td = $(el).find('td');
      const symbol = td.eq(0).text().trim();
      const name = td.eq(1).text().trim();
      const eps = numeral(td.eq(td.length - 1).text().trim()).value();
      return { symbol, name, eps, year, quarter };
    }).toArray();

    return _.orderBy(data, 'symbol', 'asc');
  }

  async fetchMonthlyRevenue(options: { market: Market, year: number, month: number, type: 0 | 1 }) {
    const { market, year, month, type } = options;
    const suffix = `${numeral(year).subtract(1911).value()}_${month}_${type}`;
    const url = `https://mops.twse.com.tw/nas/t21/${market}/t21sc03_${suffix}.html`;
    const response = await firstValueFrom(this.httpService.get(url, { responseType: 'arraybuffer' }));
    const page = iconv.decode(response.data, 'big5');
    const $ = cheerio.load(page);

    const data = $('tr [align=right]')
      .filter((_, el) => {
        const th = $(el).find('th');
        const td = $(el).find('td');
        return (th.length === 0) && !!td.eq(0).text();
      })
      .map((_, el) => {
        const td = $(el).find('td');
        const symbol = td.eq(0).text().trim();
        const name = td.eq(1).text().trim();
        const revenue = numeral(td.eq(2).text().trim()).value();
        return { symbol, name, revenue, year, month };
      })
      .toArray();

    return _.sortBy(data, 'symbol');
  }
}
