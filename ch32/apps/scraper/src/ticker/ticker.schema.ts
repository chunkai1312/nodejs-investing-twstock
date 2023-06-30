import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TickerDocument = HydratedDocument<Ticker>;

@Schema({ timestamps: true })
export class Ticker {
  @Prop({ required: true })
  date: string;

  @Prop()
  type: string;

  @Prop()
  exchange: string;

  @Prop()
  market: string;

  @Prop()
  symbol: string;

  @Prop()
  name: string;

  @Prop()
  openPrice: number;

  @Prop()
  highPrice: number;

  @Prop()
  lowPrice: number;

  @Prop()
  closePrice: number;

  @Prop()
  change: number;

  @Prop()
  changePercent: number;

  @Prop()
  tradeVolume: number;

  @Prop()
  tradeValue: number;

  @Prop()
  transaction: number;

  @Prop()
  tradeWeight: number;

  @Prop()
  finiNetBuySell: number;

  @Prop()
  sitcNetBuySell: number;

  @Prop()
  dealersNetBuySell: number;
}

export const TickerSchema = SchemaFactory.createForClass(Ticker)
  .index({ date: -1, symbol: 1 }, { unique: true });
