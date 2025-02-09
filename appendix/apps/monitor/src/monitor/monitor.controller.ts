import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('/alerts')
  getAlerts() {
    return this.monitorService.getAlerts();
  }

  @Post('/alerts')
  createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.monitorService.createAlert(createAlertDto);
  }

  @Delete('/alerts/:id')
  removeAlert(@Param('id') id: string) {
    return this.monitorService.removeAlert(id);
  }

  @Get('/orders')
  getOrders() {
    return this.monitorService.getOrders();
  }

  @Post('/orders')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.monitorService.createOrder(createOrderDto);
  }

  @Delete('/orders/:id')
  removeOrder(@Param('id') id: string) {
    return this.monitorService.removeOrder(id);
  }
}
