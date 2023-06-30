import * as csvtojson from 'csvtojson';
import * as numeral from 'numeral';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class UsdtScraperService {
  constructor(private httpService: HttpService) {}

  async fetchUsTreasuryYields(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const month = DateTime.fromISO(date).toFormat('yyyyMM');
    const query = new URLSearchParams({
      type: 'daily_treasury_yield_curve',
      field_tdr_date_value_month: month,
      _format: 'csv',
    });
    const url = `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/all/${month}?${query}`;

    const response = await firstValueFrom(this.httpService.get(url));
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(response.data);
    const [ fields, ...rows ] = json;
    if (fields[0] !== 'Date') return null;

    return rows.map(row => ({
      date: DateTime.fromFormat(row[0], 'MM/dd/yyyy').toISODate(),
      us3m: numeral(row[3]).value(),
      us2y: numeral(row[7]).value(),
      us10y: numeral(row[11]).value(),
    })).find(data => data.date === date);
  }
}
