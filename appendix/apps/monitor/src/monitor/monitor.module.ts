import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRADER_SERVICE } from '@app/common';
import { Monitor, MonitorSchema } from './monitor.schema';
import { MonitorRepository } from './monitor.repository';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitor.name, schema: MonitorSchema },
    ]),
    ClientsModule.registerAsync([{
      name: TRADER_SERVICE,
      useFactory: () => ({
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
        },
      }),
    }]),
  ],
  providers: [MonitorRepository, MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
