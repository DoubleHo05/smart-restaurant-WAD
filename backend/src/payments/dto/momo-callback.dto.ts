export class MoMoCallbackDto {
  partnerCode: string;
  orderId: string; // Our payment ID
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: string; // MoMo transaction ID
  resultCode: number; // 0 = success
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}
