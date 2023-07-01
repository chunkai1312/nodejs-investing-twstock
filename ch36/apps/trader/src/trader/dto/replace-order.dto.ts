import { IsNumber } from 'class-validator';

export class ReplaceOrderDto {
  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
