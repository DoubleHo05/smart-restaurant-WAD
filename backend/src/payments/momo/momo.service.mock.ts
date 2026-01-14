import { Injectable } from '@nestjs/common';

/**
 * Mock MoMo Service for Testing
 * Use this when you don't have real MoMo sandbox credentials
 */
@Injectable()
export class MomoServiceMock {
  async createPayment(dto: {
    payment_id: string;
    amount: number;
    order_info: string;
    restaurant_id: string;
  }) {
    // Simulate MoMo response
    return {
      transaction_id: `MOMO-MOCK-${Date.now()}`,
      qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK_MOMO_${dto.payment_id}`,
      payment_url: `http://localhost:5173/payment/mock?payment_id=${dto.payment_id}&amount=${dto.amount}`,
    };
  }

  verifySignature(data: any): boolean {
    // Always return true for testing
    console.log('🧪 [MOCK] MoMo signature verification bypassed');
    return true;
  }
}
