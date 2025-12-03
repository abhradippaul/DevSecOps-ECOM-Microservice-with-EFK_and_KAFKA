import { Module } from '@nestjs/common';
import { AuthGuardService } from './auth-guard.service';
import { ClerkClientProvider } from 'src/providers/clerk.provider';

@Module({
  providers: [AuthGuardService, ClerkClientProvider],
  exports: ['ClerkClient'],
})
export class AuthGuardModule {}
