import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  symbol: string;

  @IsNumber()
  cost: number;

  @Transform(params => params.value.split(',').map(day => Number(day)))
  @IsArray()
  days: number[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
