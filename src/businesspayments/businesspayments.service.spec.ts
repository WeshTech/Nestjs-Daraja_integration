import { Test, TestingModule } from '@nestjs/testing';
import { BusinesspaymentsService } from './businesspayments.service';

describe('BusinesspaymentsService', () => {
  let service: BusinesspaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinesspaymentsService],
    }).compile();

    service = module.get<BusinesspaymentsService>(BusinesspaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
