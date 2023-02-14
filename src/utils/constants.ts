export const SENSOR_READINGS_CHUNK_SIZE = 375;

export const SENSORS = {
  0: 'Accelerometer',
  1: 'Gyroscope',
  2: 'Magnetometer',
} as const;

export enum SOCKET_EVENTS {
  BATCH_ACCEPTED = 'batch_accepted',
  BATCH_REJECTED = 'batch_rejected',
}
