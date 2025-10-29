import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("/cat")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/:id")
  getHello(@Param("id", new DefaultValuePipe(18),new ParseIntPipe({optional:false}))id:any,): string {
 
    
    return this.appService.getHello();
  }
}
    