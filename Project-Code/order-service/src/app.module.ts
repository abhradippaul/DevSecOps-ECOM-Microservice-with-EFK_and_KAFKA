import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuardModule } from './auth-guard/auth-guard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthGuardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
