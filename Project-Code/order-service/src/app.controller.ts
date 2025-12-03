import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuardService)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/v1/health')
  checkHealth() {
    return this.appService.checkHealth();
  }
}
