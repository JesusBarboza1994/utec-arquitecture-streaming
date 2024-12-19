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

  emitStockUpdate(id: string, stock: number) {
    this.server.emit('stockUpdate', { id, stock }); // Emitir evento con datos
  }
}
