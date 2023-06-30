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
}
