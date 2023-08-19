import { IsString, IsNumber, IsEnum, IsJSON } from 'class-validator';
import { MonitorType } from '../enums';

export class CreateOrderDto {
  @IsString()
  symbol: string;

  @IsEnum(MonitorType)
  type: string;

  @IsNumber()
  value: number;

  @IsJSON()
  order: string;
}
