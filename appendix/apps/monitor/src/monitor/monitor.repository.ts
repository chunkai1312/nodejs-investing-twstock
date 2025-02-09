import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monitor, MonitorDocument } from './monitor.schema';
import { CreateAlertDto } from './dto/create-alert.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class MonitorRepository {
  constructor(
    @InjectModel(Monitor.name) private readonly model: Model<MonitorDocument>,
  ) {}

  async getMonitors() {
    return this.model.find({ triggered: false });
  }

  async triggerMonitor(id: string) {
    await this.model.updateOne({ _id: id }, { triggered: true });
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    return this.model.create({ ...createAlertDto, alert: JSON.parse(createAlertDto.alert) });
  }

  async getAlerts() {
    return this.model.find({ alert: { $exists: true } });
  }

  async removeAlert(id: string) {
    return this.model.findOneAndRemove({ _id: id, alert: { $exists: true } });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.model.create({ ...createOrderDto, order: JSON.parse(createOrderDto.order) });
  }

  async getOrders() {
    return this.model.find({ order: { $exists: true } });
  }

  async removeOrder(id: string) {
    return this.model.findOneAndRemove({ _id: id, order: { $exists: true } });
  }
}
