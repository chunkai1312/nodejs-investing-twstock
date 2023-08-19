import * as numeral from 'numeral';
import { Injectable, Logger, NotFoundException, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { InjectWebSocketClient } from '@fugle/marketdata-nest';
import { InjectLineNotify, LineNotify } from 'nest-line-notify';
import { Redis } from 'ioredis';
import { DateTime } from 'luxon';
import { WebSocketClient } from '@fugle/marketdata';
import { CreateAlertDto } from './dto/create-alert.dto';
import { MonitorRepository } from './monitor.repository';
import { Monitor } from './monitor.schema';

@Injectable()
export class MonitorService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly subscriptions = new Set<string>();

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectWebSocketClient() private readonly client: WebSocketClient,
    @InjectLineNotify() private readonly lineNotify: LineNotify,
    private readonly monitorRepository: MonitorRepository,
  ) {}

  async onApplicationBootstrap() {
    this.client.stock.connect()
      .then(() => this.monitorRepository.getMonitors())
      .then(monitors => monitors.map(monitor => this.monitor(monitor)));

    this.client.stock.on('message', (message) => {
      const { event, data } = JSON.parse(message);
      if (event === 'data') this.checkMatches(data);
    });
  }

  async onApplicationShutdown() {
    this.client.stock.disconnect();
  }

  async getAlerts() {
    return this.monitorRepository.getAlerts();
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    const monitor = await this.monitorRepository.createAlert(createAlertDto);
    await this.monitor(monitor);
    return monitor;
  }

  async removeAlert(id: string) {
    const monitor = await this.monitorRepository.removeAlert(id);
    if (!monitor) throw new NotFoundException('alert not found');
    await this.unmonitor(monitor);
    return monitor;
  }

  private async monitor(monitor: Monitor) {
    const { _id, symbol, type, value } = monitor;
    const key = `monitors:${_id}`;
    const monitable = `monitors:${symbol}:${type}`;

    await this.redis.multi()
      .set(key, JSON.stringify(monitor))
      .zadd(monitable, value, key)
      .exec();

    if (!this.subscriptions.has(symbol)) {
      this.client.stock.subscribe({ channel: 'aggregates', symbol });
      this.subscriptions.add(symbol);
    }
  }

  private async unmonitor(monitor: Monitor) {
    const { _id, symbol, type } = monitor;
    const key = `monitors:${_id}`;
    const monitable = `monitors:${symbol}:${type}`;

    await this.redis.multi()
      .zrem(monitable, key)
      .del(key)
      .exec();
  }

  private async checkMatches(data: any) {
    const { symbol, lastTrade, lastUpdated } = data;
    if (lastTrade?.time !== lastUpdated) return;

    const matches = await Promise.all([
      this.redis.zrange(`monitors:${symbol}:price:gt`, '-inf', lastTrade.price, 'BYSCORE'),
      this.redis.zrange(`monitors:${symbol}:price:lt`, lastTrade.price, '+inf', 'BYSCORE'),
    ]).then(members => [].concat.apply([], members));

    if (!matches.length) return;

    const monitors = await this.redis.mget(matches)
      .then(results => results.map(data => JSON.parse(data)));

    for (const monitor of monitors) {
      await this.unmonitor(monitor);
      if (monitor.alert) await this.sendAlert(monitor, data);
    }
  }

  private async sendAlert(monitor: Monitor, data: Record<string, any>) {
    const { _id, alert } = monitor;
    const { symbol, name, lastPrice, change, changePercent, lastUpdated } = data;
    const time = DateTime
      .fromMillis(Math.floor(lastUpdated / 1000))
      .toFormat('yyyy/MM/dd HH:mm:ss');

    const message = [''].concat([
      `<<${alert.title}>>`,
      `${alert.message}`,
      `---`,
      `${name} (${symbol})`,
      `成交: ${numeral(lastPrice).format('0.00')}`,
      `漲跌: ${numeral(change).format('+0.00')} (${numeral(changePercent).format('+0.00')}%)`,
      `時間: ${time}`,
    ]).join('\n');

    await this.lineNotify.send({ message })
      .then(() => this.monitorRepository.triggerMonitor(_id))
      .catch(err => Logger.error(err.message, err.stack, MonitorService.name));
  }
}
