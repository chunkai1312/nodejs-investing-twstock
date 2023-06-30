import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticker, TickerSchema } from './ticker.schema';
import { TickerRepository } from './ticker.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticker.name, schema: TickerSchema },
    ]),
  ],
  providers: [TickerRepository],
})
export class TickerModule {}
