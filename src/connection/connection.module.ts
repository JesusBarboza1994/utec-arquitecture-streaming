import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionGateway } from './connection.gateway';
import { ConnectionController } from './connection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from 'src/db/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [ConnectionController],
  providers: [ConnectionGateway, ConnectionService],
})
export class ConnectionModule {}
