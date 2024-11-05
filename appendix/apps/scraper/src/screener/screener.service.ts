import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotifierService } from '@app/core/notifier';
import { DateTime } from 'luxon';
import { TickerRepository } from '../ticker/ticker.repository';

@Injectable()
export class ScreenerService {
  constructor(
    private readonly tickerRepository: TickerRepository,
    private readonly notifierService: NotifierService,
  ) {}

  @Cron('0 30 22 * * *')
  async sendSelection(date: string = DateTime.local().toISODate()) {
    const { name, tickers, date: dataDate } = await this.selectNew20DayHighs({ date });
    const message = [''].concat([
      `<<${name}>>`,
      `---`,
      `${tickers.map(({symbol, name}) => `${name} (${symbol})`).join('\n')}`,
      `---`,
      `資料日期: ${DateTime.fromISO(dataDate).toFormat('yyyy/MM/dd')}`,
    ]).join('\n');

    await this.notifierService.send(message)
      .then(() => Logger.log(`"${name}" 已送出`, ScreenerService.name))
      .catch((err) => Logger.error(err.message, err.stack, ScreenerService.name));
  }

  async selectNew20DayHighs(options?: { date: string }) {
    const name = '股價與成交量創20日新高強勢股';
    const dt = options?.date ? DateTime.fromISO(options.date) : DateTime.local();
    const startDate = dt.minus({ months: 3 }).toISODate();
    const endDate = dt.toISODate();
    const results = await this.tickerRepository.getTickers({ startDate, endDate });
    const date = results[0].date;

    const tickers = _(results).groupBy('symbol')
      .filter(quotes => {
        const [last, ...data] = quotes.slice(0, 20);
        const highPrice = _.maxBy(data, 'highPrice')?.highPrice;
        const highVolume = _.maxBy(data, 'tradeVolume')?.tradeVolume;
        const isNewHighPrice = last.closePrice > highPrice;
        const isNewHighVolume = last.tradeVolume > highVolume;
        return (last.date === date) && isNewHighPrice && isNewHighVolume;
      })
      .map(quotes => quotes[0])
      .value();

    return { name, tickers, date };
  }
}
