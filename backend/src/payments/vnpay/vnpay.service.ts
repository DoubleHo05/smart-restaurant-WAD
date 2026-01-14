import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VnPayService {
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly url: string;
  private readonly returnUrl: string;
  private readonly ipnUrl: string;

  constructor(private configService: ConfigService) {
    this.tmnCode = this.configService.getOrThrow<string>('VNPAY_TMN_CODE');
    this.hashSecret =
      this.configService.getOrThrow<string>('VNPAY_HASH_SECRET');
    this.url = this.configService.getOrThrow<string>('VNPAY_URL');
    this.returnUrl = this.configService.getOrThrow<string>('VNPAY_RETURN_URL');
    this.ipnUrl = this.configService.getOrThrow<string>('VNPAY_IPN_URL');
  }

  private createHash(data: string): string {
    return crypto
      .createHmac('sha512', this.hashSecret)
      .update(data)
      .digest('hex');
  }

  private sortObject(obj: any): any {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  createPaymentUrl(dto: {
    payment_id: string;
    amount: number;
    order_info: string;
    restaurant_id: string;
  }) {
    const { payment_id, amount, order_info } = dto;
    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(
      new Date(date.getTime() + 15 * 60 * 1000),
    );

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: order_info,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: this.returnUrl,
      vnp_TxnRef: payment_id,
      vnp_ExpireDate: expireDate,
    };

    vnp_Params = this.sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, '&', '=', {
      encodeURIComponent: (str) => str,
    });
    const secureHash = this.createHash(signData);
    vnp_Params['vnp_SecureHash'] = secureHash;

    const paymentUrl = this.url + '?' + querystring.stringify(vnp_Params);

    return {
      transaction_id: payment_id,
      payment_url: paymentUrl,
      qr_code: null,
    };
  }

  verifySignature(query: any): boolean {
    const vnp_SecureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    const sortedParams = this.sortObject(query);
    const signData = querystring.stringify(sortedParams, '&', '=', {
      encodeURIComponent: (str) => str,
    });
    const expectedHash = this.createHash(signData);

    return vnp_SecureHash === expectedHash;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
