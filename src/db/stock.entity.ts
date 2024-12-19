import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id_stock: number;

  @Column()
  id_producto: number;

  @Column({ type: 'int' })
  stock_actual: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  stock_valorizado: number;

  @Column({ type: 'datetime' })
  fecha_actualizacion: Date;

  @Column({ type: 'datetime' })
  fecha_extraccion: Date;
}
