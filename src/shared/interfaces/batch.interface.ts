import { z } from 'zod';
import { BatchSchema } from '@/shared/schemas/batch.schema';
import { SOCKET_EVENTS } from '@/utils/constants';

export type Batch = z.infer<typeof BatchSchema>;

export interface BatchResponse {
  event: SOCKET_EVENTS.BATCH_ACCEPTED | SOCKET_EVENTS.BATCH_REJECTED;
  original_timestamp: number;
  original_sequence_number: number;
  server_timestamp: number;
  server_sequence_number: number;
}

export interface ServerToClientEvents {
  batch_response: (e: BatchResponse) => void;
}

export interface ClientToServerEvents {
  send_batch: (e: Batch) => void;
}
