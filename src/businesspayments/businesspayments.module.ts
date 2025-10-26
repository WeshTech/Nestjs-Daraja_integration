import { Module } from '@nestjs/common';
import { BusinesspaymentsService } from './businesspayments.service';
import { BusinesspaymentsController } from './businesspayments.controller';

@Module({
  controllers: [BusinesspaymentsController],
  providers: [BusinesspaymentsService],
})
export class BusinesspaymentsModule {}
