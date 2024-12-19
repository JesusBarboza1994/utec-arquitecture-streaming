import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConnectionService } from './connection.service';

interface StockUpdateInfoDto {
  id: string;
  stock: number;
}

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}
  @Post()
  stockUpdateInfo(@Body() body: StockUpdateInfoDto) {
    this.connectionService.socketEmit(body.id, body.stock);
  }

  @Get()
  async listStock() {
    const stockList = await this.connectionService.getAllStock();

    return stockList;
  }

  @Get('/:id')
  async getStockById(@Param('id') id: string) {
    const stock = await this.connectionService.getStockById(Number(id));
    return stock;
  }
}
