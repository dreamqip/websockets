import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { SessionModule } from './session/session.module';
import { SessionService } from '@/session/session.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    UsersModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, SessionService],
})
export class AppModule {}
