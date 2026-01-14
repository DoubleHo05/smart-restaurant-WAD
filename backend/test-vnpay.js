/**
 * 🧪 VNPAY PAYMENT TESTING SCRIPT
 * Chạy: node test-vnpay.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// === CẬP NHẬT CONFIG ===
// Lấy tokens từ: node get-tokens.js
const CONFIG = {
  customerToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDk4NTAxMC03ZWUzLTQwNGQtOTMwNy0wNDc3MTc5MzgyMjUiLCJlbWFpbCI6ImN1c3RvbWVyQHRlc3QuY29tIiwicm9sZXMiOlsiY3VzdG9tZXIiXSwiaWF0IjoxNzY4Mzk1NDIwLCJleHAiOjE3NjkwMDAyMjB9.7DuFtNhJkdLALvKfyKSxnbiaBoPnpO_LfcXMcQd70jw', // Từ POST /auth/login
  waiterToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTg4YzMxYy0zM2YwLTRiYjgtYjk5OS04OTcwNGM2ZmRkNzUiLCJlbWFpbCI6IndhaXRlckB0ZXN0LmNvbSIsInJvbGVzIjpbIndhaXRlciJdLCJpYXQiOjE3NjgzOTU0MjEsImV4cCI6MTc2OTAwMDIyMX0.A3IF20PJcvbbiYFwYq2MzLqafVhMYACoSIEFnkm1nJc',
  tableId: '832d2ddd-ffb2-432d-820e-af86eddc0f63', // Table T05 (from Supabase)
};

async function testVNPayFlow() {
  console.log('🧪 ============ VNPAY PAYMENT TEST ============\n');
  console.log(
    '⚙️  Ngrok URL: https://unwithered-undepressively-latashia.ngrok-free.dev',
  );
  console.log('⚙️  Backend: http://localhost:3000\n');

  try {
    // ==========================================
    // STEP 1: Customer tạo bill request
    // ==========================================
    console.log('1️⃣  STEP 1: Customer tạo bill request...');
    const billResponse = await axios.post(
      `${BASE_URL}/bill-requests`,
      {
        table_id: CONFIG.tableId,
        payment_method: 'vnpay', // ✅ Chọn VNPay
        tips_amount: 30000,
        customer_note: 'Test VNPay payment',
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.customerToken}` },
      },
    );

    console.log('✅ Bill Request Created:');
    console.log('   ID:', billResponse.data.id);
    console.log(
      '   Subtotal:',
      billResponse.data.subtotal.toLocaleString(),
      'VND',
    );
    console.log(
      '   Tips:',
      billResponse.data.tips_amount.toLocaleString(),
      'VND',
    );
    console.log(
      '   Total:',
      billResponse.data.total_amount.toLocaleString(),
      'VND',
    );
    console.log('   Status:', billResponse.data.status);

    const billRequestId = billResponse.data.id;
    const totalAmount = billResponse.data.total_amount;

    // ==========================================
    // STEP 2: Waiter accept bill request
    // ==========================================
    console.log('\n2️⃣  STEP 2: Waiter accepting bill request...');
    const acceptResponse = await axios.post(
      `${BASE_URL}/bill-requests/${billRequestId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${CONFIG.waiterToken}` },
      },
    );

    console.log('✅ Payment Created:');
    console.log('   Payment ID:', acceptResponse.data.payment_id);
    console.log('   Transaction ID:', acceptResponse.data.transaction_id);
    console.log('   Payment URL:', acceptResponse.data.payment_url);
    console.log('\n🌐 Payment URL để test:');
    console.log('   → ' + acceptResponse.data.payment_url);

    // ==========================================
    // STEP 3: Hướng dẫn test manual
    // ==========================================
    console.log('\n3️⃣  STEP 3: TEST MANUAL - Làm theo hướng dẫn:');
    console.log('   1. Copy payment URL ở trên');
    console.log('   2. Mở trong browser');
    console.log('   3. Chọn bank: NCB');
    console.log('   4. Nhập thông tin test card VNPay:');
    console.log('      - Số thẻ: 9704198526191432198');
    console.log('      - Tên chủ thẻ: NGUYEN VAN A');
    console.log('      - Ngày phát hành: 07/15');
    console.log('      - Mật khẩu OTP: 123456');
    console.log('   5. VNPay sẽ gọi IPN callback về ngrok URL');

    console.log('\n4️⃣  STEP 4: Kiểm tra kết quả trong database:');
    console.log(`   -- Check payment status
   SELECT id, status, gateway_trans_id, completed_at 
   FROM payments 
   WHERE id = '${acceptResponse.data.payment_id}';

   -- Check bill_request status
   SELECT id, status 
   FROM bill_requests 
   WHERE id = '${billRequestId}';

   -- Check orders status
   SELECT id, status 
   FROM orders 
   WHERE id = ANY(
     SELECT UNNEST(order_ids) 
     FROM bill_requests 
     WHERE id = '${billRequestId}'
   );`);

    console.log('\n✅ Test script completed. Chờ VNPay callback...');
    console.log('📊 Summary:');
    console.log('   Bill Request ID:', billRequestId);
    console.log('   Payment ID:', acceptResponse.data.payment_id);
    console.log('   Amount:', totalAmount.toLocaleString(), 'VND');
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status Code:', error.response.status);
      console.error(
        '   Details:',
        JSON.stringify(error.response.data, null, 2),
      );
    }
    process.exit(1);
  }
}

// ==========================================
// KIỂM TRA CALLBACK WEBHOOK
// ==========================================
async function checkWebhookSetup() {
  console.log('🔍 Checking webhook setup...\n');

  const ngrokUrl = 'https://unwithered-undepressively-latashia.ngrok-free.dev';

  try {
    const response = await axios.get(`${ngrokUrl}/payments/vnpay/ipn`, {
      validateStatus: () => true, // Accept any status
    });
    console.log('✅ Ngrok tunnel is working!');
    console.log('   Status:', response.status);
  } catch (error) {
    console.error('❌ Ngrok tunnel not accessible!');
    console.error('   Make sure ngrok is running: ngrok http 3000');
    process.exit(1);
  }
}

// ==========================================
// RUN TEST
// ==========================================
async function runTest() {
  console.log('🚀 VNPay Payment Test\n');
  console.log('📋 Prerequisites:');
  console.log('   ✅ Backend running on http://localhost:3000');
  console.log('   ✅ Ngrok running: ngrok http 3000');
  console.log('   ✅ Updated CONFIG with valid tokens\n');

  // Check config
  if (CONFIG.customerToken.includes('YOUR_')) {
    console.error('❌ Please update CONFIG with your tokens and table ID!');
    console.error('   Get tokens by calling POST /api/auth/login');
    process.exit(1);
  }

  await checkWebhookSetup();
  console.log('');
  await testVNPayFlow();
}

runTest();
