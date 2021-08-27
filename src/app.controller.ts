import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {时间戳
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query() query): string {
    return Date.now().toString();
  }
}
