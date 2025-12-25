import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  checkHealth() {
    return {
      message: 'Auth Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

}
