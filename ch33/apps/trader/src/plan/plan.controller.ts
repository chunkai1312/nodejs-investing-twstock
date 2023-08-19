import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('sip')
export class PlanController {
  constructor(private readonly PlanService: PlanService) {}

  @Get('/plans')
  async getPlans() {
    return this.PlanService.getPlans();
  }

  @Post('/plans')
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.PlanService.createPlan(createPlanDto);
  }

  @Delete('/plans/:id')
  async removePlan(@Param('id') id: string) {
    return this.PlanService.removePlan(id);
  }
}
