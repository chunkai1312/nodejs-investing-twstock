import { IsNumber, IsOptional } from 'class-validator';

export class ReplaceOrderDto {
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  quantity: number;
}
