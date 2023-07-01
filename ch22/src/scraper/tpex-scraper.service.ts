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
      { symbol: 'IX0044', name: '櫃買紡纖類指數' },
      { symbol: 'IX0045', name: '櫃買機械類指數' },
      { symbol: 'IX0046', name: '櫃買鋼鐵類指數' },
      { symbol: 'IX0048', name: '櫃買營建類指數' },
      { symbol: 'IX0049', name: '櫃買航運類指數' },
      { symbol: 'IX0050', name: '櫃買觀光類指數' },
      { symbol: 'IX0100', name: '櫃買其他類指數' },
      { symbol: 'IX0051', name: '櫃買化工類指數' },
      { symbol: 'IX0052', name: '櫃買生技醫療類指數' },
      { symbol: 'IX0053', name: '櫃買半導體類指數' },
      { symbol: 'IX0054', name: '櫃買電腦及週邊類指數' },
      { symbol: 'IX0055', name: '櫃買光電業類指數' },
      { symbol: 'IX0056', name: '櫃買通信網路類指數' },
      { symbol: 'IX0057', name: '櫃買電子零組件類指數' },
      { symbol: 'IX0058', name: '櫃買電子通路類指數' },
      { symbol: 'IX0059', name: '櫃買資訊服務類指數' },
      { symbol: 'IX0099', name: '櫃買其他電子類指數' },
      { symbol: 'IX0075', name: '櫃買文化創意業類指數' },
      { symbol: 'IX0189', name: '櫃買綠能環保類指數' },
      { symbol: 'IX0190', name: '櫃買數位雲端類指數' },
      { symbol: 'IX0191', name: '櫃買居家生活類指數' },
      { symbol: 'IX0047', name: '櫃買電子類指數' },
      { symbol: 'IX0043', name: '櫃買指數' },
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

  async fetchIndicesTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const sectorMappings = {
      '光電業': { symbol: 'IX0055', name: '櫃買光電業類指數' },
      '其他': { symbol: 'IX0100', name: '櫃買其他類指數' },
      '其他電子業': { symbol: 'IX0099', name: '櫃買其他電子類指數' },
      '化學工業': { symbol: 'IX0051', name: '櫃買化工類指數' },
      '半導體業': { symbol: 'IX0053', name: '櫃買半導體類指數' },
      '居家生活': { symbol: 'IX0191', name: '櫃買居家生活類指數' },
      '建材營造': { symbol: 'IX0048', name: '櫃買營建類指數' },
      '數位雲端': { symbol: 'IX0190', name: '櫃買數位雲端類指數' },
      '文化創意業': { symbol: 'IX0075', name: '櫃買文化創意業類指數' },
      '生技醫療': { symbol: 'IX0052', name: '櫃買生技醫療類指數' },
      '紡織纖維': { symbol: 'IX0044', name: '櫃買紡纖類指數' },
      '綠能環保': { symbol: 'IX0189', name: '櫃買綠能環保類指數' },
      '航運業': { symbol: 'IX0049', name: '櫃買航運類指數' },
      '觀光餐旅': { symbol: 'IX0050', name: '櫃買觀光類指數' },
      '資訊服務業': { symbol: 'IX0059', name: '櫃買資訊服務類指數' },
      '通信網路業': { symbol: 'IX0056', name: '櫃買通信網路類指數' },
      '鋼鐵工業': { symbol: 'IX0046', name: '櫃買鋼鐵類指數' },
      '電子通路業': { symbol: 'IX0058', name: '櫃買電子通路類指數' },
      '電子零組件業': { symbol: 'IX0057', name: '櫃買電子零組件類指數' },
      '電機機械': { symbol: 'IX0045', name: '櫃買機械類指數' },
      '電腦及週邊設備業': { symbol: 'IX0054', name: '櫃買電腦及週邊類指數' },
    };

    const electronics = [
      'IX0053', 'IX0054', 'IX0055', 'IX0056',
      'IX0057', 'IX0058', 'IX0059', 'IX0099',
    ];

    const data = json.aaData.map(row => {
      const [sector, ...values] = row;
      return {
        date,
        symbol: sectorMappings[sector]?.symbol,
        name: sectorMappings[sector]?.name,
        tradeValue: numeral(values[0]).value(),
        tradeWeight: numeral(values[1]).value(),
      };
    });

    const [electronic] = _(data)
      .filter(data => electronics.includes(data.symbol))
      .groupBy(_ => 'IX0047')
      .map((data, symbol) => ({
        date,
        symbol,
        name: '櫃買電子類指數',
        tradeValue: _.sumBy(data, 'tradeValue'),
        tradeWeight: +numeral(_.sumBy(data, 'tradeWeight')).format('0.00'),
      }))
      .value();

    return [...data, electronic].filter(index => index.symbol);
  }

  async fetchEquitiesQuotes(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const isWarrant = (symbol: string) => {
      const rules = [
        /^7[0-3][0-9][0-9][0-9][0-9]$/,
        /^7[0-3][0-9][0-9][0-9]P$/,
        /^7[0-3][0-9][0-9][0-9]F$/,
        /^7[0-3][0-9][0-9][0-9]Q$/,
        /^7[0-3][0-9][0-9][0-9]C$/,
        /^7[0-3][0-9][0-9][0-9]B$/,
        /^7[0-3][0-9][0-9][0-9]X$/,
        /^7[0-3][0-9][0-9][0-9]Y$/,
      ];
      return rules.some(regex => regex.test(symbol));
    };

    return json.aaData
      .filter(row => !isWarrant(row[0]))
      .map(row => {
        const [symbol, name, ...values] = row;
        const data: Record<string, any> = { date, symbol, name };
        data.openPrice = numeral(values[2]).value();
        data.highPrice = numeral(values[3]).value();
        data.lowPrice = numeral(values[4]).value();
        data.closePrice = numeral(values[0]).value();
        data.tradeVolume = numeral(values[6]).value();
        data.tradeValue = numeral(values[7]).value();
        data.transaction = numeral(values[8]).value();
        data.change = numeral(values[1]).value();
        data.changePercent = (data.closePrice && data.change !== null)
          ? +numeral(data.change).divide(data.closePrice - data.change).multiply(100).format('0.00')
          : 0;
        return data;
      });
  }

  async fetchEquitiesInstInvestorsTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      se: 'EW',
      t: 'D',
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return json.aaData.map(row => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = { date, symbol, name };
      data.finiNetBuySell = numeral(values[8]).value();
      data.sitcNetBuySell = numeral(values[11]).value();
      data.dealersNetBuySell = numeral(values[20]).value();
      return data;
    });
  }
}
