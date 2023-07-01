import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectModel(Plan.name) private readonly model: Model<PlanDocument>,
  ) {}

  async getPlans() {
    return this.model.find({ completed: false });
  }

  async createPlan(createPlanDto: CreatePlanDto) {
    const { days, startDate, endDate } = createPlanDto;

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const preorders = [];

    for (let current = start; current <= end; current = current.plus({ day: 1 })) {
      if (days.includes(current.get('day'))) {
        preorders.push({ date: current.toISODate(), placed: false });
      }
    }

    return this.model.create({ ...createPlanDto, preorders });
  }

  async removePlan(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id });
  }

  async getPlansToExecute(date: string) {
    return this.model.find({
      completed: false,
      startDate: { $lte: date },
      endDate: { $gte: date },
      preorders: {
        $elemMatch: {
          date: { $lte: date },
          placed: false,
        },
      },
    });
  }

  async updateExecutedPlan(id: string, date: string): Promise<PlanDocument> {
    return this.model.findOneAndUpdate(
      { _id: id, 'preorders.date': date },
      { $set: { 'preorders.$.placed': true } },
      { new: true },
    );
  }
}
