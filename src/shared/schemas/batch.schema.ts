import { z } from 'zod';
import { BATCH_SIZE } from '@/utils/constants';

const SensorReadingSchema = z
  .array(
    z.tuple([
      z.number(),
      z.number().min(0).max(2),
      z.number(),
      z.number(),
      z.number(),
    ]),
  )
  .nonempty()
  .length(BATCH_SIZE);

const TimestampSchema = z.number();

const SequenceNumberSchema = z.number().int().min(0);

export const BatchSchema = z.object({
  timestamp: TimestampSchema,
  sequence_number: SequenceNumberSchema,
  sensor_readings: SensorReadingSchema,
});
