import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Chunk } from '@/utils/interfaces/chunk.interface';
import { SENSORS } from '@/utils/constants';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  private sequenceNumber = 0;

  incrementSequenceNumber(): void {
    this.sequenceNumber++;
  }

  getSequenceNumber(): number {
    return this.sequenceNumber;
  }

  resetSequenceNumber(): void {
    this.sequenceNumber = 0;
  }

  async writeChunkToDatabase(chunk: Chunk) {
    const res = await this.prisma.sensorReading.createMany({
      data: [
        ...chunk.sensor_readings.map((reading) => ({
          sessionId: 1,
          created_at: new Date(reading[0]),
          sensor: Object.values(SENSORS)[reading[1]],
          xAxis: reading[2],
          yAxis: reading[3],
          zAxis: reading[4],
        })),
      ],
    });
    console.log(res);
  }
}
