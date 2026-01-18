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

    // VNPay uses PHP urlencode which converts space to +
    // encodeURIComponent converts space to %20, need to replace
    const vnpayEncode = (str: string) => {
      return encodeURIComponent(String(str)).replace(/%20/g, '+');
    };

    // Build signature string WITH URL encoding (VNPay requirement)
    const signData = Object.keys(vnp_Params)
      .map((key) => `${vnpayEncode(key)}=${vnpayEncode(vnp_Params[key])}`)
      .join('&');

    console.log('🔐 [VNPay] Creating signature:');
    console.log('   TMN Code:', this.tmnCode);
    console.log('   Hash Secret:', this.hashSecret);
    console.log('   Sign Data:', signData);

    const secureHash = this.createHash(signData);
    console.log('   Secure Hash:', secureHash);

    // Build URL with same encoded params + hash
    const paymentUrl =
      this.url + '?' + signData + '&vnp_SecureHash=' + secureHash;

    return {
      transaction_id: payment_id,
      payment_url: paymentUrl,
      qr_code: null,
    };
  }

  verifySignature(query: any): boolean {
    console.log('🔍 [VNPay Verify] Starting signature verification');

    // Clone query để không mutate original
    const params = { ...query };
    const vnp_SecureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    console.log('📦 Hash received:', vnp_SecureHash);

    const sortedParams = this.sortObject(params);

    // VNPay PHP dùng urlencode, cần match với cách họ tạo hash
    // Khi return, VNPay gửi data đã decode, nên cần encode lại để verify
    const signData = Object.keys(sortedParams)
      .map((key) => {
        // Encode như PHP urlencode (space → +)
        const encodedKey = encodeURIComponent(key).replace(/%20/g, '+');
        const encodedValue = encodeURIComponent(sortedParams[key]).replace(
          /%20/g,
          '+',
        );
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');

    console.log('📝 Sign data (encoded):', signData.substring(0, 200) + '...');

    const expectedHash = this.createHash(signData);
    console.log('🔐 Expected hash:', expectedHash);
    console.log('✅ Match:', vnp_SecureHash === expectedHash);

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
