import { Body, Controller, Post } from '@nestjs/common';
import { BusinesspaymentsService } from './businesspayments.service';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';
import { MpesaCallbackDto } from './dtos/success.dto';

@Controller('businesspayments')
export class BusinesspaymentsController {
  constructor(
    private readonly businesspaymentsService: BusinesspaymentsService,
  ) {}

  //create payment
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.businesspaymentsService.createPayment(createPaymentDto);
  }

  //handle callback
  @Post('callback')
  async handleCallback(@Body() callbackDto: MpesaCallbackDto) {
    return await this.businesspaymentsService.handleMpesaCallback(callbackDto);
  }
}
