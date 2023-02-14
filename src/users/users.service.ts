import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByPublicKey(publicKey: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        publicKey,
      },
    });
  }
}
