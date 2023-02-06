import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: any): any {
    this.logger.log('client connected');
    client.emit('connection', {
      event: 'connection',
      timestamp: Date.now(),
      sequence_number: 0,
    });
  }

  handleDisconnect(client: any): any {
    this.logger.log('client disconnected');
    client.emit('disconnection', {
      event: 'disconnection',
      timestamp: Date.now(),
      sequence_number: 0,
    });
  }

  @SubscribeMessage('send_batch')
  handleEvent(@MessageBody() data: any): any {
    console.log('batch received');
    return {
      event: 'batch_received',
      original_timestamp: data.timestamp,
      original_sequence_number: data.sequence_number,
      server_timestamp: Date.now(),
      server_sequence_number: 0,
    };
  }

  // @SubscribeMessage('time_msg')
  // handleTimeEvent(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() socket: Socket,
  // ): void {
  //   console.log('time_msg received');
  //   socket.emit('time_msg', {
  //     event: 'time_msg',
  //     original_timestamp: data.timestamp,
  //     original_sequence_number: data.sequence_number,
  //     server_timestamp: Date.now(),
  //     server_sequence_number: 0,
  //   });
  // }
}
