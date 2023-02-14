import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { type Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSessionById(id: number) {
    await this.prisma.session.findFirstOrThrow({
      where: {
        id,
        destroyedAt: null,
      },
    });

    return await this.prisma.session.create({
      data: {
        user: {
          connect: {
            // NOTE: Not sure if this is the correct way to do this
            id,
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
}
