import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MomoService {
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly endpoint: string;
  private readonly ipnUrl: string;
  private readonly redirectUrl: string;
  private readonly testMode: boolean;

  constructor(private configService: ConfigService) {
    // Enable test mode to bypass MoMo API calls
    this.testMode =
      this.configService.get<string>('PAYMENT_TEST_MODE') === 'true';

    this.partnerCode =
      this.configService.get<string>('MOMO_PARTNER_CODE') || 'TEST_PARTNER';
    this.accessKey =
      this.configService.get<string>('MOMO_ACCESS_KEY') || 'TEST_ACCESS_KEY';
    this.secretKey =
      this.configService.get<string>('MOMO_SECRET_KEY') || 'TEST_SECRET_KEY';
    this.endpoint =
      this.configService.get<string>('MOMO_ENDPOINT') ||
      'https://test-payment.momo.vn/v2/gateway/api/create';
    this.ipnUrl =
      this.configService.get<string>('MOMO_IPN_URL') ||
      'http://localhost:3000/api/payments/momo/callback';
    this.redirectUrl =
      this.configService.get<string>('MOMO_REDIRECT_URL') ||
      'http://localhost:5173/payment/result';
  }

  private createSignature(rawData: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(rawData)
      .digest('hex');
  }

  async createPayment(dto: {
    payment_id: string;
    amount: number;
    order_info: string;
    restaurant_id: string;
  }) {
    // 🧪 TEST MODE: Return mock data without calling MoMo API
    if (this.testMode) {
      console.log('🧪 [TEST MODE] MoMo API call bypassed');
      return {
        transaction_id: `MOMO-TEST-${Date.now()}`,
        qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK_MOMO_${dto.payment_id}`,
        payment_url: `http://localhost:5173/payment/mock?gateway=momo&payment_id=${dto.payment_id}&amount=${dto.amount}`,
      };
    }

    const { payment_id, amount, order_info } = dto;
    const requestId = `${payment_id}-${Date.now()}`;
    const orderId = payment_id;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${order_info}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo: order_info,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      requestType,
      extraData,
      lang: 'vi',
      signature,
    };

    try {
      const response = await axios.post(this.endpoint, requestBody);

      if (response.data.resultCode !== 0) {
        throw new Error(`MoMo error: ${response.data.message}`);
      }

      return {
        transaction_id: response.data.requestId,
        qr_code: response.data.qrCodeUrl || null,
        payment_url: response.data.payUrl,
      };
    } catch (error) {
      throw new Error(`MoMo API error: ${error.message}`);
    }
  }

  verifySignature(data: any): boolean {
    // 🧪 TEST MODE: Bypass signature verification
    if (this.testMode) {
      console.log('🧪 [TEST MODE] MoMo signature verification bypassed');
      return true;
    }

    const {
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = data;

    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${this.partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = this.createSignature(rawSignature);
    return signature === expectedSignature;
  }
}
