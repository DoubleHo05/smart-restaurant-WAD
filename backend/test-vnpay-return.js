/**
 * 🧪 Test VNPay Return URL Handler
 * 
 * Sau khi thanh toán VNPay, copy URL từ browser
 * (http://localhost:5173/payment/result?vnp_Amount=...&vnp_SecureHash=...)
 * và chạy script này
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Paste URL từ browser sau khi thanh toán thành công
const VNPAY_RETURN_URL = process.argv[2];

if (!VNPAY_RETURN_URL) {
  console.log('❌ Usage: node test-vnpay-return.js "<full_return_url>"');
  console.log('');
  console.log('Ví dụ:');
  console.log('  node test-vnpay-return.js "http://localhost:5173/payment/result?vnp_Amount=10150220&vnp_BankCode=NCB&..."');
  console.log('');
  console.log('Hoặc nhập query string:');
  console.log('  node test-vnpay-return.js "vnp_Amount=10150220&vnp_BankCode=NCB&..."');
  process.exit(1);
}

async function testVNPayReturn() {
  console.log('🧪 Testing VNPay Return Handler\n');
  
  // Extract query params from URL
  let queryString = VNPAY_RETURN_URL;
  
  if (VNPAY_RETURN_URL.includes('?')) {
    queryString = VNPAY_RETURN_URL.split('?')[1];
  }
  
  console.log('📦 Query String:', queryString.substring(0, 100) + '...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/vnpay/return?${queryString}`);
    
    console.log('\n✅ Response from backend:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\n🎉 Payment verified and updated successfully!');
      console.log('   Payment ID:', response.data.payment_id);
      console.log('   Amount:', (response.data.amount || 0).toLocaleString(), 'VND');
    } else {
      console.log('\n⚠️  Payment verification failed');
      console.log('   Response Code:', response.data.RspCode);
      console.log('   Message:', response.data.Message);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

testVNPayReturn();
