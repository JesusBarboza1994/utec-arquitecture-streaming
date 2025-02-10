import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ConnectionService, StockUpdateItemsDto } from './connection.service';

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
  async listStock(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('limit') limit: number = 50,
  ) {
    const stockList = await this.connectionService.getStock(
      page,
      limit,
      search,
    );

    return stockList;
  }

  @Get('/:id')
  async getStockById(@Param('id') id: string) {
    const stock = await this.connectionService.getStockById(Number(id));
    return stock;
  }

  @Patch('/purchase')
  async updateStockItems(@Body() body: StockUpdateItemsDto[]) {
    const stock = await this.connectionService.updateStockItems(body);
    return stock;
  }
}
