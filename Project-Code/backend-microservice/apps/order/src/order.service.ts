import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {

  getHello(): string {
    return 'Hello World!';
  }

  checkHealth() {
    return {
      message: 'Order Server is healthy',
    };
  }
}
