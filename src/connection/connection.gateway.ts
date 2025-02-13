import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConnectionGateway {
  @WebSocketServer()
  server: Server;

  emitStockUpdate(id: string, stock: number, fecha_actualizacion: string) {
    this.server.emit('stockUpdate', { id, stock, fecha_actualizacion }); // Emitir evento con datos
  }
}
