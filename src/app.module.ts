import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './connection/connection.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'fake-database-grupo3-1.cfqay6u8sikg.us-east-1.rds.amazonaws.com', // Cambia según tu configuración
      port: 3306,
      username: 'admin', // Usuario de la base de datos
      password: 'awsrdsgruop3fakerlaboratorio', // Contraseña de la base de datos
      database: 'bd-grupo-3-v3', // Nombre de la base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Escanea todas las entidades
    }),
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
