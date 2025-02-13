import { Injectable, NotFoundException } from '@nestjs/common';
import { ConnectionGateway } from './connection.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/db/stock.entity';
import { Like, Repository, In } from 'typeorm';

export interface GetAllStockResponse {
  stocks: StockAdapter[];
  pages: number;
}
export interface StockAdapter {
  id_stock: number;
  id_producto: number;
  stock_actual: number;
  fecha_actualizacion: string;
}

export interface StockUpdateItemsDto {
  id_producto: number;
  stock_actual: number;
}

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private readonly connectionGateway: ConnectionGateway,
  ) {}
  socketEmit(id: string, stock: number, fecha_actualizacion: string) {
    this.connectionGateway.emitStockUpdate(id, stock, this.formatDateTime(new Date(fecha_actualizacion)));
    console.log(`Emitiendo stock: ${id}, ${stock}`);
  }

  async getStock(
    page: number = 1,
    limit: number = 50,
    search?: string,
  ): Promise<GetAllStockResponse> {
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? [
          { id_stock: Like(`%${search}%`) }, // Buscar en `id_stock`
          { id_producto: Like(`%${search}%`) }, // Buscar en `id_producto`
        ]
      : {};

    const [stocks, total] = await this.stockRepository.findAndCount({
      select: [
        'id_stock',
        'id_producto',
        'fecha_actualizacion',
        'stock_actual',
      ],
      where: whereCondition,
      take: limit,
      skip: offset,
    });

    const formatStock: StockAdapter[] = stocks.map((stock) => {
      return {
        id_stock: stock.id_stock,
        id_producto: stock.id_producto,
        stock_actual: stock.stock_actual,
        fecha_actualizacion: this.formatDateTime(stock.fecha_actualizacion),
      };
    });

    return {
      stocks: formatStock,
      pages: Math.ceil(total / limit),
    };
  }

  async getStockById(id_stock: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { id_stock } });
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id_stock} no encontrado`);
    }
    return stock;
  }

  async updateStockItems(body: StockUpdateItemsDto[]): Promise<{ stocks: StockAdapter[] }> {
    // Verificar existencia de stocks
    const ids = body.map((item) => item.id_producto);
    const existingStocks = await this.stockRepository.findBy({
      id_producto: In(ids),
    });

    if (existingStocks.length !== ids.length) {
      const existingIds = existingStocks.map((stock) => stock.id_stock);
      const missingIds = ids.filter((id: number) => !existingIds.includes(id));
      throw new NotFoundException(
        `Stocks no encontrados: ${missingIds.join(', ')}`,
      );
    }

    // Construir la consulta CASE para restar el stock
    const cases = body
      .map(
        (item) => `WHEN id_producto = ${item.id_producto} THEN stock_actual - ${item.stock_actual}`,
      )
      .join(' ');
    // Realizar la actualización en una sola consulta
    await this.stockRepository
      .createQueryBuilder()
      .update(Stock)
      .set({
        stock_actual: () => `CASE ${cases} ELSE stock_actual END`,
        fecha_actualizacion: new Date(),
      })
      .where('id_stock IN (:...ids)', { ids })
      .execute();

    // Obtener los stocks actualizados
    const updatedStocks = await this.stockRepository.find({
      where: { id_producto: In(ids) },
      select: ['id_stock', 'id_producto', 'fecha_actualizacion', 'stock_actual'],
    });

    return {
      stocks: updatedStocks.map((stock) => ({
        id_stock: stock.id_stock,
        id_producto: stock.id_producto,
        stock_actual: stock.stock_actual,
        fecha_actualizacion: this.formatDateTime(stock.fecha_actualizacion),
      })),
    };
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Lima',
    });
  }
}
