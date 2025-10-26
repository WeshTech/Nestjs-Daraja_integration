import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Matches,
  IsString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(07|01)\d{8}$/, {
    message: 'Phone number must be 10 digits and start with 07 or 01',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(1, { message: 'Amount must be at least 1' })
  @Max(250000, { message: 'Amount cannot exceed KES 250,000 (M-Pesa limit)' })
  amount: number;
}
