import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { AuthorizationResponse, StkPushResponse } from './types/payments.types';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';

@Injectable()
export class BusinesspaymentsService {
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly shortcode: string;
  private readonly passkey: string;
  private readonly callbackUrl: string;
  private readonly sandboxUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.consumerKey = this.configService.getOrThrow<string>(
      'DARAJA_CONSUMER_KEY',
    );
    this.consumerSecret = this.configService.getOrThrow<string>(
      'DARAJA_CONSUMER_SECRET',
    );
    this.shortcode = this.configService.getOrThrow<string>(
      'SANDBOX_BUSINESS_SHORTCODE',
    );
    this.passkey = this.configService.getOrThrow<string>('SANDBOX_PASSKEY');
    this.callbackUrl = this.configService.getOrThrow<string>(
      'SANDBOX_CALLBACK_URL',
    );
    this.sandboxUrl =
      this.configService.getOrThrow<string>('DARAJA_SANDBOX_URL');
  }

  //  Get OAuth access token from Daraja
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString('base64');

    const response = await axios.get<AuthorizationResponse>(
      `${this.sandboxUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    return response.data.access_token;
  }

  //  Generate STK push password
  private generatePassword(timestamp: string): string {
    return Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString(
      'base64',
    );
  }

  //  Format Kenyan phone numbers for M-Pesa
  private formatPhoneNumber(phone: string): string {
    return phone.startsWith('254') ? phone : `254${phone.slice(1)}`;
  }

  //  Initialize an M-Pesa STK Push
  private async initializeStkPush(
    phoneNumber: string,
    amount: string,
    accessToken: string,
  ): Promise<StkPushResponse> {
    const amountNumber = Math.floor(Number(amount));
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);
    const password = this.generatePassword(timestamp);

    const requestData = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amountNumber,
      PartyA: phoneNumber,
      PartyB: Number(this.shortcode),
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: 'Test',
      TransactionDesc: 'pay test',
    };
    try {
      const response = await axios.post<StkPushResponse>(
        `${this.sandboxUrl}/mpesa/stkpush/v1/processrequest`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to send payment request: ${error}`);
      return {
        success: false,
        message: 'Failed to send payment request',
        data: null,
      };
    }
  }

  // Create a payment request
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const accessToken = await this.getAccessToken();
    const phoneNumber = this.formatPhoneNumber(
      createPaymentDto.phoneNumber.toString(),
    );

    const stkResponse = await this.initializeStkPush(
      phoneNumber,
      createPaymentDto.amount.toString(),
      accessToken,
    );

    if (
      stkResponse.success &&
      stkResponse.data &&
      stkResponse.data.ResponseCode === '0'
    ) {
      return {
        success: true,
        message: 'Payment request sent to phone number',
        data: null,
      };
    }
  }
}
