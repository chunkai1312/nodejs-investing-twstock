import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarketStatsDocument = HydratedDocument<MarketStats>;

@Schema({ timestamps: true })
export class MarketStats {
  @Prop({ required: true })
  date: string;

  @Prop()
  taiexPrice: number;

  @Prop()
  taiexChange: number;

  @Prop()
  taiexTradeValue: number;

  @Prop()
  finiNetBuySell: number;

  @Prop()
  sitcNetBuySell: number;

  @Prop()
  dealersNetBuySell: number;

  @Prop()
  marginBalance: number;

  @Prop()
  marginBalanceChange: number;

  @Prop()
  shortBalance: number;

  @Prop()
  shortBalanceChange: number;

  @Prop()
  finiTxfNetOi: number;

  @Prop()
  finiTxoCallsNetOiValue: number;

  @Prop()
  finiTxoPutsNetOiValue: number;

  @Prop()
  topTenSpecificFrontMonthTxfNetOi: number;

  @Prop()
  topTenSpecificBackMonthsTxfNetOi: number;

  @Prop()
  retailMxfNetOi: number;

  @Prop()
  retailMxfLongShortRatio: number;

  @Prop()
  txoPutCallRatio: number;

  @Prop()
  usdtwd: number;
}

export const MarketStatsSchema = SchemaFactory.createForClass(MarketStats)
  .index({ date: -1 }, { unique: true });
