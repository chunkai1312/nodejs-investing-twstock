import { Command, CommandRunner, Option } from 'nest-commander';
import { DateTime } from 'luxon';
import { StrategyFactory } from './strategies/strategy-factory';
import { BacktesterService } from './backtester.service';

@Command({
  name: 'backtest',
  arguments: '<symbol>',
  options: { isDefault: true },
})
export class BacktesterCommand extends CommandRunner {
  constructor(private readonly backtesterService: BacktesterService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const [ symbol ] = passedParams;
    const { strategy, startDate, endDate, ...backtestOptions } = options;
    const data = await this.backtesterService.getHistoricalData(symbol, startDate, endDate);
    await this.backtesterService.runBacktest(data, strategy, backtestOptions);
  }

  @Option({
    flags: '-s, --strategy [name]',
    description: 'trading strategy',
    required: true,
  })
  parseStrategy(name: string) {
    const Strategy = StrategyFactory.create(name);
    if (!Strategy) throw new Error('invalid trading strategy');
    return name;
  }

  @Option({
    flags: '-start, --start-date [date]',
    description: 'start date',
    defaultValue: DateTime.local().minus({ year: 1 }).toISODate(),
  })
  parseStartDate(date: string) {
    const dt = DateTime.fromISO(date);
    if (!dt.isValid) throw new Error('invalid date');
    return dt.toISODate();
  }

  @Option({
    flags: '-end, --end-date [date]',
    description: 'end date',
    defaultValue: DateTime.local().toISODate(),
  })
  parseEndDate(date: string) {
    const dt = DateTime.fromISO(date);
    if (!dt.isValid) throw new Error('invalid date');
    return dt.toISODate();
  }

  @Option({
    flags: '--cash [number]',
    description: 'initial cash',
    defaultValue: 1000000,
  })
  parseCash(value: string) {
    return Number(value);
  }

  @Option({
    flags: '--commission [number]',
    description: 'commission ratio',
    defaultValue: 0,
  })
  parseCommission(value: string) {
    return Number(value);
  }

  @Option({
    flags: '--margin [number]',
    description: 'margin ratio',
    defaultValue: 1,
  })
  parseMargin(value: string) {
    return Number(value);
  }

  @Option({
    flags: '--trade-on-close [boolean]',
    description: 'trade on close',
    defaultValue: false,
  })
  parseTradeOnClose(value: string) {
    return JSON.parse(value);
  }

  @Option({
    flags: '--hedging [boolean]',
    description: 'hedging',
    defaultValue: false,
  })
  parseHedging(value: string) {
    return JSON.parse(value);
  }

  @Option({
    flags: '--exclusive-orders [boolean]',
    description: 'exclusive orders',
    defaultValue: false,
  })
  parseExclusiveOrders(value: string) {
    return JSON.parse(value);
  }
}
