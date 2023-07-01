import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Monitor, MonitorSchema } from './monitor.schema';
import { MonitorRepository } from './monitor.repository';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitor.name, schema: MonitorSchema },
    ]),
  ],
  providers: [MonitorRepository, MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
