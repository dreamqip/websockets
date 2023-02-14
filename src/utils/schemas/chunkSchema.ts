import { z } from 'zod';
import { SENSOR_READINGS_CHUNK_SIZE } from '@/utils/constants';

const SensorReadingSchema = z
  .array(
    z.tuple([
      // Timestamp
      z.number(),
      // Sensor ID
      z.number().min(0).max(2),
      // Sensor readings (x, y, z)
      z.number(),
      z.number(),
      z.number(),
    ]),
  )
  .nonempty()
  .length(SENSOR_READINGS_CHUNK_SIZE);

const TimestampSchema = z.number();

const SequenceNumberSchema = z.number().int().min(0);

export const ChunkSchema = z.object({
  timestamp: TimestampSchema,
  sequence_number: SequenceNumberSchema,
  sensor_readings: SensorReadingSchema,
});
