import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionGateway } from './connection.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/db/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private readonly connectionGateway: ConnectionGateway,
  ) {}
  socketEmit(id: string, stock: number) {
    this.connectionGateway.emitStockUpdate(id, stock);
    console.log(`Emitiendo stock: ${id}, ${stock}`);
  }

  async getAllStock(): Promise<Stock[]> {
    return this.stockRepository.find(); // SELECT * FROM stock
  }

  async getStockById(id_stock: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { id_stock } });
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id_stock} no encontrado`);
    }
    return stock;
  }
}
