export const BATCH_SIZE = 150;

export const SENSORS_IDS = {
  Accelerometer: 0,
  Gyroscope: 1,
  Magnetometer: 2,
} as const;

export enum SOCKET_EVENTS {
  BATCH_ACCEPTED = 'batch_accepted',
  BATCH_REJECTED = 'batch_rejected',
}
