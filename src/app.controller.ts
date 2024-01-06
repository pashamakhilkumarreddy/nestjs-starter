import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get('/health')
  @Public()
  async checkHealth() {
    this.logger.debug('Health Check API');
    return this.appService.checkHealth();
  }
}
