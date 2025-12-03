import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  checkHealth() {
    return {
      message: 'Server is healthy',
    };
  }
}
