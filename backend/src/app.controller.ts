import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      message: 'Scholarship platform API is running',
      instance: process.env.INSTANCE_NAME || 'backend-default',
      timestamp: new Date().toISOString(),
    };
  }
}