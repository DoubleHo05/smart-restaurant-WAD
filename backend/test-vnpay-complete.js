/**
 * 🧪 COMPLETE VNPAY TEST - Tạo order + Bill request + Payment
 * Chạy: node test-vnpay-complete.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// === CẬP NHẬT CONFIG ===
const CONFIG = {
  customerToken: 'YOUR_CUSTOMER_TOKEN',
  waiterToken: 'YOUR_WAITER_TOKEN',
  tableId: '020dd679-31da-497e-e6-df-d7f4b0a0d493', // Table T05
  restaurantId: 'YOUR_RESTAURANT_UUID', // Lấy từ database
  menuItemId: 'YOUR_MENU_ITEM_UUID', // Lấy từ database
};

async function completeVNPayTest() {
  console.log('🧪 ============ COMPLETE VNPAY TEST ============\n');

  try {
    // ==========================================
    // STEP 0: Tạo order cho table
    // ==========================================
    console.log('0️⃣  STEP 0: Creating order for table...');
    const orderResponse = await axios.post(
      `${BASE_URL}/orders`,
      {
        table_id: CONFIG.tableId,
        items: [
          {
            menu_item_id: CONFIG.menuItemId,
            quantity: 2,
            special_instructions: 'Test order for payment',
          },
        ],
        customer_note: 'Test order',
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.customerToken}` },
      },
    );

    console.log('✅ Order Created:');
    console.log('   Order ID:', orderResponse.data.id);
    console.log('   Order Number:', orderResponse.data.order_number);
    console.log('   Total:', orderResponse.data.total.toLocaleString(), 'VND');
    console.log('   Status:', orderResponse.data.status);

    // Wait a bit for order to be processed
    console.log('\n⏳ Waiting 2 seconds for order processing...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // ==========================================
    // STEP 1: Customer tạo bill request
    // ==========================================
    console.log('\n1️⃣  STEP 1: Customer tạo bill request...');
    const billResponse = await axios.post(
      `${BASE_URL}/bill-requests`,
      {
        table_id: CONFIG.tableId,
        payment_method: 'vnpay',
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

    console.log('\n✅ Test flow completed!');
    console.log('📊 Summary:');
    console.log('   Order ID:', orderResponse.data.id);
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

// Check config
if (CONFIG.customerToken.includes('YOUR_')) {
  console.error('❌ Please update CONFIG with your tokens!');
  console.error('   Run: node get-tokens-simple.js');
  process.exit(1);
}

completeVNPayTest();
