import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { BatchValidationPipe } from './pipes/batch-validation.pipe';
import {
  Batch,
  BatchResponse,
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/shared/interfaces/batch.interface';
import { SOCKET_EVENTS } from '@/utils/constants';
import { BatchSchema } from '@/shared/schemas/batch.schema';
import { ZodError } from 'zod';

@WebSocketGateway(8080)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: Server = new Server<ServerToClientEvents, ClientToServerEvents>();

  constructor(private appService: AppService) {}

  // guard against invalid connection
  handleConnection(client: Socket): void {
    this.logger.log('client connected');
    const sequenceNumber = this.appService.getSequenceNumber();
    client.emit('connection', {
      timestamp: Date.now(),
      sequence_number: sequenceNumber,
    });
  }

  @UsePipes(new BatchValidationPipe(BatchSchema))
  @SubscribeMessage('send_batch')
  handleEvent(@MessageBody() data: ZodError | Batch): void {
    this.logger.log('batch received');
    this.appService.incrementSequenceNumber();
    let response: BatchResponse;

    const sequenceNumber = this.appService.getSequenceNumber();

    if ('errors' in data || data.sequence_number !== sequenceNumber) {
      response = {
        event: SOCKET_EVENTS.BATCH_REJECTED,
        original_timestamp: 'timestamp' in data ? data.timestamp : Date.now(),
        original_sequence_number:
          'sequence_number' in data ? data.sequence_number : sequenceNumber,
        server_timestamp: Date.now(),
        server_sequence_number: sequenceNumber,
      };
    } else {
      response = {
        event: SOCKET_EVENTS.BATCH_ACCEPTED,
        original_timestamp: data.timestamp,
        original_sequence_number: data.sequence_number,
        server_timestamp: Date.now(),
        server_sequence_number: sequenceNumber,
      };
    }

    this.server.emit('batch_response', response);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log('client disconnected');
    const sequenceNumber = this.appService.getSequenceNumber();
    client.emit('disconnection', {
      timestamp: Date.now(),
      sequence_number: sequenceNumber,
    });
    this.appService.resetSequenceNumber();
  }
}
