import { Test, TestingModule } from '@nestjs/testing';
import { BusinesspaymentsController } from './businesspayments.controller';
import { BusinesspaymentsService } from './businesspayments.service';

describe('BusinesspaymentsController', () => {
  let controller: BusinesspaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinesspaymentsController],
      providers: [BusinesspaymentsService],
    }).compile();

    controller = module.get<BusinesspaymentsController>(BusinesspaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
