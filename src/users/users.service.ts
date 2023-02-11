import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

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
