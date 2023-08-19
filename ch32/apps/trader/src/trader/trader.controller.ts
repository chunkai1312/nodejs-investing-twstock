import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TraderService } from './trader.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { ReplaceOrderDto } from './dto/replace-order.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('trader')
export class TraderController {
  constructor(private readonly traderService: TraderService) {}

  @Get('/orders')
  async getOrders() {
    return this.traderService.getOrders();
  }

  @Post('/orders')
  async placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    return this.traderService.placeOrder(placeOrderDto);
  }

  @Patch('/orders/:id')
  async replaceOrder(@Param('id') id: string, @Body() replaceOrderDto: ReplaceOrderDto) {
    return this.traderService.replaceOrder(id, replaceOrderDto);
  }

  @Delete('/orders/:id')
  async cancelOrder(@Param('id') id: string) {
    return this.traderService.cancelOrder(id);
  }

  @Get('/transactions')
  async getTransactions(@Query() getTransactionsDto: GetTransactionsDto) {
    return this.traderService.getTransactions(getTransactionsDto);
  }

  @Get('/inventories')
  async getInventories() {
    return this.traderService.getInventories();
  }

  @Get('/settlements')
  async getSettlements() {
    return this.traderService.getSettlements();
  }

  @Get('/balance')
  async getBalance() {
    return this.traderService.getBalance();
  }

  @EventPattern('place-order')
  async handleOrder(@Payload() placeOrderDto) {
    return this.traderService.placeOrder(placeOrderDto);
  }
}
