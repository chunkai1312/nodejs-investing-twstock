import * as csvtojson from 'csvtojson';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class TaifexScraperService {
  constructor(private httpService: HttpService) {}

  async fetchInstInvestorsTxfTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'TXF',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    );
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [fields, dealers, sitc, fini] = json;
    if (fields[0] !== '日期') return null;

    return {
      date,
      finiTxfNetOi: numeral(fini[13]).value(),
      sitcTxfNetOi: numeral(sitc[13]).value(),
      dealersTxfNetOi: numeral(dealers[13]).value(),
    };
  }

  async fetchInstInvestorsTxoTrades(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'TXO',
    });
    const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    );
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [fields, dealersCalls, sitcCalls, finiCalls, dealersPuts, sitcPuts, finiPuts] = json;
    if (fields[0] !== '日期') return null;

    return {
      date,
      finiTxoCallsNetOi: numeral(finiCalls[14]).value(),
      finiTxoCallsNetOiValue: numeral(finiCalls[15]).value(),
      sitcTxoCallsNetOi: numeral(sitcCalls[14]).value(),
      sitcTxoCallsNetOiValue: numeral(sitcCalls[15]).value(),
      dealersTxoCallsNetOi: numeral(dealersCalls[14]).value(),
      dealersTxoCallsNetOiValue: numeral(dealersCalls[15]).value(),
      finiTxoPutsNetOi: numeral(finiPuts[14]).value(),
      finiTxoPutsNetOiValue: numeral(finiPuts[15]).value(),
      sitcTxoPutsNetOi: numeral(sitcPuts[14]).value(),
      sitcTxoPutsNetOiValue: numeral(sitcPuts[15]).value(),
      dealersTxoPutsNetOi: numeral(dealersPuts[14]).value(),
      dealersTxoPutsNetOiValue: numeral(dealersPuts[15]).value(),
    };
  }

  private async fetchMxfMarketOi(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      down_type: '1',
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodity_id: 'MTX',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futDataDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    )
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [fields, ...rows] = json;
    if (fields[0] !== '交易日期') return null;

    const mxfMarketOi = rows
      .filter(row => row[17] === '一般' && !row[18])
      .reduce((oi, row) => oi + numeral(row[11]).value(), 0);

    return { date, mxfMarketOi };
  }

  private async fetchInstInvestorsMxfOi(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'MXF',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    );
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [fields, dealers, sitc, fini] = json;
    if (fields[0] !== '日期') return null;

    const dealersLongOi = numeral(dealers[9]).value();
    const dealersShortOi = numeral(dealers[11]).value();
    const sitcLongOi = numeral(sitc[9]).value();
    const sitcShortOi = numeral(sitc[11]).value();
    const finiLongOi = numeral(fini[9]).value();
    const finiShortOi = numeral(fini[11]).value();
    const instInvestorsMxfLongOi = dealersLongOi + sitcLongOi + finiLongOi;
    const instInvestorsMxfShortOi = dealersShortOi + sitcShortOi + finiShortOi;

    return { date, instInvestorsMxfLongOi, instInvestorsMxfShortOi };
  }

  async fetchRetailMxfPosition(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [fetchedMxfMarketOi, fetchedInstInvestorsMxfOi] = await Promise.all([
      this.fetchMxfMarketOi(options),
      this.fetchInstInvestorsMxfOi(options),
    ]);
    if (!fetchedMxfMarketOi || !fetchedInstInvestorsMxfOi) return null;

    const { mxfMarketOi } = fetchedMxfMarketOi;
    const { instInvestorsMxfLongOi, instInvestorsMxfShortOi } = fetchedInstInvestorsMxfOi;
    const retailMxfLongOi = mxfMarketOi - instInvestorsMxfLongOi;
    const retailMxfShortOi = mxfMarketOi - instInvestorsMxfShortOi;
    const retailMxfNetOi = retailMxfLongOi - retailMxfShortOi;
    const retailMxfLongShortRatio = Math.round(retailMxfNetOi / mxfMarketOi * 10000) / 10000;

    return { date, retailMxfLongOi, retailMxfShortOi, retailMxfNetOi, retailMxfLongShortRatio };
  }

  async fetchLargeTradersTxfPosition(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    );
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [fields, ...rows] = json;
    if (fields[0] !== '日期') return null;

    const txRows = rows.filter(row => row[1] === 'TX');
    const topTenFrontMonthTxfLongOi = numeral(txRows[2][7]).value();
    const topTenFrontMonthTxfShortOi = numeral(txRows[2][8]).value();
    const topTenFrontMonthTxfNetOi = topTenFrontMonthTxfLongOi - topTenFrontMonthTxfShortOi;
    const topTenSpecificFrontMonthTxfLongOi = numeral(txRows[3][7]).value();
    const topTenSpecificFrontMonthTxfShortOi = numeral(txRows[3][8]).value();
    const topTenSpecificFrontMonthTxfNetOi = topTenSpecificFrontMonthTxfLongOi - topTenSpecificFrontMonthTxfShortOi;
    const topTenNonspecificFrontMonthTxfNetOi = topTenFrontMonthTxfNetOi - topTenSpecificFrontMonthTxfNetOi;
    const topTenAllMonthsTxfLongOi = numeral(txRows[4][7]).value();
    const topTenAllMonthsTxfShortOi = numeral(txRows[4][8]).value();
    const topTenAllMonthsTxfNetOi = topTenAllMonthsTxfLongOi - topTenAllMonthsTxfShortOi;
    const topTenSpecificAllMonthsTxfLongOi = numeral(txRows[5][7]).value();
    const topTenSpecificAllMonthsTxfShortOi = numeral(txRows[5][8]).value();
    const topTenSpecificAllMonthsTxfNetOi = topTenSpecificAllMonthsTxfLongOi - topTenSpecificAllMonthsTxfShortOi;
    const topTenNonspecificAllMonthsTxfNetOi = topTenAllMonthsTxfNetOi - topTenSpecificAllMonthsTxfNetOi;
    const topTenSpecificBackMonthsTxfNetOi = topTenSpecificAllMonthsTxfNetOi - topTenSpecificFrontMonthTxfNetOi;
    const topTenNonspecificBackMonthsTxfNetOi = topTenNonspecificAllMonthsTxfNetOi - topTenNonspecificFrontMonthTxfNetOi;
    const allMonthsTxfMarketOi = numeral(txRows[4][9]).value();

    return {
      date,
      topTenSpecificFrontMonthTxfNetOi,
      topTenSpecificBackMonthsTxfNetOi,
      topTenNonspecificFrontMonthTxfNetOi,
      topTenNonspecificBackMonthsTxfNetOi,
      allMonthsTxfMarketOi,
    };
  }

  async fetchTxoPutCallRatio(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';

    const response = await firstValueFrom(
      this.httpService.post(url, form, { responseType: 'arraybuffer' }),
    );
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(
      iconv.decode(response.data, 'big5'),
    );
    const [_, row] = json;
    if (!row) return null;
    if (DateTime.fromString(row[0], 'yyyy/MM/dd').toISODate() !== date) return null;
    
    const txoPutCallRatio = numeral(row[6]).divide(100).value();

    return { date, txoPutCallRatio };
  }
}
