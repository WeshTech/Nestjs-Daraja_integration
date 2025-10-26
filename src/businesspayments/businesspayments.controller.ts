import { Body, Controller, Post } from '@nestjs/common';
import { BusinesspaymentsService } from './businesspayments.service';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';

@Controller('businesspayments')
export class BusinesspaymentsController {
  constructor(
    private readonly businesspaymentsService: BusinesspaymentsService,
  ) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.businesspaymentsService.createPayment(createPaymentDto);
  }
}
