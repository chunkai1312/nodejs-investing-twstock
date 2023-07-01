import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './plan.schema';
import { PlanRepository } from './plan.repository';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
    ]),
  ],
  providers: [PlanRepository, PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
