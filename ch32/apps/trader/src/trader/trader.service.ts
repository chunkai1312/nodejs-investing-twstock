
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectFugleTrade, Streamer } from '@fugle/trade-nest';
import { FugleTrade, Order, OrderPayload } from '@fugle/trade';
import { InjectLineNotify, LineNotify } from 'nest-line-notify';
import { PlaceOrderDto } from './dto/place-order.dto';
import { ReplaceOrderDto } from './dto/replace-order.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { getOrderSideName, getOrderTypeName, getPriceTypeName, getTradeTypeName } from './utils/get-names.util';

@Injectable()
export class TraderService {
  private readonly logger = new Logger(TraderService.name);

  constructor(
    @InjectFugleTrade() private readonly fugle: FugleTrade,
    @InjectLineNotify() private readonly lineNotify: LineNotify,
  ) {}

  async getOrders() {
    return this.fugle.getOrders()
      .then(orders => orders.map(order => order.payload))
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async placeOrder(placeOrderDto: PlaceOrderDto) {
    const payload = placeOrderDto as OrderPayload;
    const order = new Order(payload);
    return this.fugle.placeOrder(order)
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async replaceOrder(id: string, replaceOrderDto: ReplaceOrderDto) {
    const orders = await this.fugle.getOrders();
    const order = orders.find(order =>
      [order.payload.ordNo, order.payload.preOrdNo].includes(id)
    );
    if (!order) throw new NotFoundException('order not found');

    return this.fugle.replaceOrder(order, replaceOrderDto)
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async cancelOrder(id: string) {
    const orders = await this.fugle.getOrders();
    const order = orders.find(order =>
      [order.payload.ordNo, order.payload.preOrdNo].includes(id)
    );
    if (!order) throw new NotFoundException('order not found');

    return this.fugle.cancelOrder(order)
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async getTransactions(getTransactionsDto: GetTransactionsDto) {
    const { range } = getTransactionsDto;
    return this.fugle.getTransactions(range)
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async getInventories() {
    return this.fugle.getInventories()
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async getSettlements() {
    return this.fugle.getSettlements()
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  async getBalance() {
    return this.fugle.getBalance()
      .catch(err => {
        throw new InternalServerErrorException(err.message);
      });
  }

  @Streamer.OnConnect()
  async onConnect() {
    this.logger.log('Streamer.onConnect');
  }

  @Streamer.OnDisconnect()
  async onDisconnect() {
    this.logger.log('Streamer.onDisconnect');
    this.fugle.streamer.connect();
  }

  @Streamer.OnOrder()
  async onOrder(data) {
    this.logger.log(`Streamer.OnOrder ${JSON.stringify(data)}`);

    const { action, stockNo, buySell, bsFlag, trade, odPrice, orgQty, afterQty, apCode, priceFlag } = data;
    const actionName = action === 'M' ? '改量' : action === 'C' ? '刪單' : action === 'R' ? '改價' : '委託';
    const side = getOrderSideName(buySell);
    const orderType = getOrderTypeName(bsFlag) || '';
    const tradeType = getTradeTypeName(trade);
    const isOddLot = apCode === Order.ApCode.Odd || apCode === Order.ApCode.Emg || apCode === Order.ApCode.IntradayOdd;

    const price = (() => {
      const price = Number(odPrice);
      if (action === 'R') return '';
      if (apCode === Order.ApCode.AfterMarket) return '收盤價';
      return (price === 0) ? getPriceTypeName(priceFlag) : price;
    })();

    const priceUnit = (action === 'R' || Number(odPrice) === 0) ? '' : '元';
    const size = action === 'O' ? Number(orgQty) : Number(afterQty);
    const sizeUnit: string = isOddLot ? '股' : '張';

    const info = (() => {
      const actions = {
        '刪單': '已刪單',
        '改量': `已改為 ${size} ${sizeUnit}`,
        '改價': `已改為 ${Number(odPrice)} 元`,
        '委託': `${size} ${sizeUnit}`,
      };
      return actions[actionName];
    })();

    const message = [''].concat([
      `<<委託回報>>`,
      `${stockNo}：${price} ${priceUnit} ${orderType} ${tradeType} ${side} ${info}`,
    ]).join('\n');

    await this.lineNotify.send({ message })
      .catch((err) => this.logger.error(err.message, err.stack));
  }

  @Streamer.OnTrade()
  async onTrade(data) {
    this.logger.log(`Streamer.OnTrade ${JSON.stringify(data)}`);

    const { stockNo, buySell, trade, matPrice, matQty } = data;
    const side = getOrderSideName(buySell);
    const tradeType = getTradeTypeName(trade);
    const price: string | number = Number(matPrice);
    const priceUnit: string = price === 0 ? '' : '元';
    const size = Number(matQty);
    const sizeUnit = '股';

    const message = [''].concat([
      `<<成交回報>>`,
      `${stockNo}：${price} ${priceUnit} ${tradeType} ${side} ${size} ${sizeUnit} 已成交`,
    ]).join('\n');

    await this.lineNotify.send({ message })
      .catch((err) => this.logger.error(err.message, err.stack));
  }

  @Streamer.OnError()
  async onError(err) {
    this.logger.error(err.message, err.stack);
    this.fugle.streamer.disconnect();
  }
}
