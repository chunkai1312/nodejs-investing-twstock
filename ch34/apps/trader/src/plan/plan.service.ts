import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRestClient } from '@fugle/marketdata-nest';
import { InjectFugleTrade } from '@fugle/trade-nest';
import { InjectLineNotify, LineNotify } from 'nest-line-notify';
import { DateTime } from 'luxon';
import { RestClient } from '@fugle/marketdata';
import { FugleTrade, Order } from '@fugle/trade';
import { PlanRepository } from './plan.repository';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRestClient() private readonly client: RestClient,
    @InjectFugleTrade() private readonly fugle: FugleTrade,
    @InjectLineNotify() private readonly lineNotify: LineNotify,
    private readonly PlanRepository: PlanRepository,
  ) {}

  async getPlans() {
    return this.PlanRepository.getPlans();
  }

  async createPlan(createPlanDto: CreatePlanDto) {
    return this.PlanRepository.createPlan(createPlanDto);
  }

  async removePlan(id: string) {
    return this.PlanRepository.removePlan(id);
  }

  @Cron('0 29 13 * * *')
  async execute() {
    const dt = DateTime.local();
    const date = dt.toISODate();
    const time = dt.toFormat('yyyy/MM/dd HH:mm:ss');

    try {
      const plans = await this.PlanRepository.getPlansToExecute(date);

      for (const plan of plans) {
        const res = await this.client.stock.intraday.quote({ symbol: plan.symbol, type: 'oddlot' });
        if (res.date !== date) continue;

        const price = res.asks.pop().price;
        const quantity =  Math.floor(plan.cost / price);

        const order = new Order({
          stockNo: plan.symbol,
          buySell: Order.Side.Buy,
          price,
          quantity,
          apCode: Order.ApCode.IntradayOdd,
          priceFlag: Order.PriceFlag.Limit,
          bsFlag: Order.BsFlag.ROD,
          trade: Order.Trade.Cash,
        });

        const message = [''].concat([
          `<<定期定額>>`,
          `${res.name} (${res.symbol})`,
          `價格: ${price}`,
          `數量: ${quantity}`,
          `時間: ${time}`,
        ]).join('\n');

        await this.lineNotify.send({ message });
        await this.fugle.placeOrder(order);
        const preorder = plan.preorders.find(preorder => preorder.date <= date && preorder.placed === false);
        await this.PlanRepository.updateExecutedPlan(plan.id, preorder.date);
      }
    } catch (err) {
      Logger.error(err.message, err.stack, PlanService.name);
    }
  }
}
