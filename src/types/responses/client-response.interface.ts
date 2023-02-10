export interface ClientResponse {
  timestamp: number;
  sequence_number: number;
  sensor_readings: [number, 0 | 1 | 2, number, number, number][];
}
