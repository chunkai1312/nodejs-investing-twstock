import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Order } from '@fugle/trade';

export class PlaceOrderDto {
  @IsString()
  stockNo: string;

  @IsEnum(Order.Side)
  buySell: string;

  @IsNumber()
  price?: number

  @IsNumber()
  quantity: number;

  @IsEnum(Order.ApCode)
  apCode: string;

  @IsEnum(Order.PriceFlag)
  priceFlag: string;

  @IsEnum(Order.BsFlag)
  bsFlag: string;

  @IsEnum(Order.Trade)
  trade: string;
}
