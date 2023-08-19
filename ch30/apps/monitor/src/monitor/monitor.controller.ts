import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateAlertDto } from './dto/create-alert.dto';

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
}
