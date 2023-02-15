import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { type Session } from '@prisma/client';
import { Chunk } from '@/utils/interfaces/chunk.interface';
import { SENSORS } from '@/utils/constants';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: number): Promise<Session> {
    await this.prisma.session.findFirstOrThrow({
      where: {
        userId,
        destroyedAt: null,
      },
    });

    return await this.prisma.session.create({
      data: {
        user: {
          connect: {
            // NOTE: Not sure if this is the correct way to do this
            id: userId,
          },
        },
      },
    });
  }

  async getSessionById(id: number): Promise<Session> {
    return await this.prisma.session.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async destroySessionById(id: number): Promise<Session> {
    const currentSession = await this.prisma.session.findFirstOrThrow({
      where: {
        id,
      },
    });

    if (currentSession.destroyedAt) {
      throw new Error('Session already destroyed');
    }

    return await this.prisma.session.update({
      where: {
        id,
      },
      data: {
        destroyedAt: new Date(),
      },
    });
  }

  async writeChunkToDatabase(chunk: Chunk) {
    await this.prisma.sensorReading.createMany({
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
  }
}
