import {
  IsString,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
  IsObject,
  IsNotEmpty,
  Equals,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for Amount item
export class AmountItemDto {
  @IsString()
  @IsNotEmpty()
  @Equals('Amount')
  Name: string;

  @IsNumber()
  @IsNotEmpty()
  Value: number;
}

// DTO for MpesaReceiptNumber item
export class MpesaReceiptNumberItemDto {
  @IsString()
  @IsNotEmpty()
  @Equals('MpesaReceiptNumber')
  Name: string;

  @IsString()
  @IsNotEmpty()
  Value: string;
}

// DTO for TransactionDate item
export class TransactionDateItemDto {
  @IsString()
  @IsNotEmpty()
  @Equals('TransactionDate')
  Name: string;

  @IsInt()
  @IsNotEmpty()
  Value: number;
}

// DTO for PhoneNumber item
export class PhoneNumberItemDto {
  @IsString()
  @IsNotEmpty()
  @Equals('PhoneNumber')
  Name: string;

  @IsInt()
  @IsNotEmpty()
  Value: number;
}

// DTO for CallbackMetadata
export class CallbackMetadataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'Name',
      subTypes: [
        { value: AmountItemDto, name: 'Amount' },
        { value: MpesaReceiptNumberItemDto, name: 'MpesaReceiptNumber' },
        { value: TransactionDateItemDto, name: 'TransactionDate' },
        { value: PhoneNumberItemDto, name: 'PhoneNumber' },
      ],
    },
  })
  Item: (
    | AmountItemDto
    | MpesaReceiptNumberItemDto
    | TransactionDateItemDto
    | PhoneNumberItemDto
  )[];
}

// DTO for stkCallback
export class StkCallbackDto {
  @IsString()
  @IsNotEmpty()
  MerchantRequestID: string;

  @IsString()
  @IsNotEmpty()
  CheckoutRequestID: string;

  @IsInt()
  ResultCode: number;

  @IsString()
  @IsNotEmpty()
  ResultDesc: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CallbackMetadataDto)
  CallbackMetadata: CallbackMetadataDto;
}

// DTO for Body
export class BodyDto {
  @IsObject()
  @ValidateNested()
  @Type(() => StkCallbackDto)
  stkCallback: StkCallbackDto;
}

// Top-level DTO
export class MpesaCallbackDto {
  @IsObject()
  @ValidateNested()
  @Type(() => BodyDto)
  Body: BodyDto;
}
