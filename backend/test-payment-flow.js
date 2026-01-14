/**
 * 🧪 PAYMENT TESTING SCRIPT
 * Run: node test-payment-flow.js
 *
 * Test payment flow without real gateway credentials
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// === CONFIGURATION ===
// Get these from your database after creating test data
const CONFIG = {
  customerToken: 'your-customer-jwt-token',
  waiterToken: 'your-waiter-jwt-token',
  tableId: 'your-table-uuid',
  restaurantId: 'your-restaurant-uuid',
};

async function testMoMoFlow() {
  console.log('🧪 ============ MOMO PAYMENT TEST ============\n');

  try {
    // Step 1: Create Bill Request
    console.log('1️⃣ Creating bill request...');
    const billResponse = await axios.post(
      `${BASE_URL}/bill-requests`,
      {
        table_id: CONFIG.tableId,
        payment_method: 'momo',
        tips_amount: 50000,
        customer_note: 'Test payment',
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.customerToken}` },
      },
    );
    console.log('✅ Bill Request Created:', billResponse.data.id);
    console.log('   Total Amount:', billResponse.data.total_amount);
    const billRequestId = billResponse.data.id;

    // Step 2: Waiter Accept Bill Request
    console.log('\n2️⃣ Waiter accepting bill request...');
    const acceptResponse = await axios.post(
      `${BASE_URL}/bill-requests/${billRequestId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${CONFIG.waiterToken}` },
      },
    );
    console.log('✅ Payment Created:', acceptResponse.data.payment_id);
    console.log('   Transaction ID:', acceptResponse.data.transaction_id);
    console.log('   QR Code:', acceptResponse.data.qr_code);
    console.log('   Payment URL:', acceptResponse.data.payment_url);

    // Step 3: Simulate MoMo Callback (Success)
    console.log('\n3️⃣ Simulating MoMo callback (SUCCESS)...');
    const callbackPayload = {
      partnerCode: 'TEST_PARTNER',
      orderId: acceptResponse.data.payment_id,
      requestId: acceptResponse.data.transaction_id,
      amount: acceptResponse.data.total_amount,
      orderInfo: 'Test payment',
      orderType: 'momo_wallet',
      transId: `TEST-TRANS-${Date.now()}`,
      resultCode: 0, // 0 = success
      message: 'Successful',
      payType: 'webApp',
      responseTime: Date.now(),
      extraData: '',
      signature: 'test-signature', // Bypassed in TEST_MODE
    };

    const callbackResponse = await axios.post(
      `${BASE_URL}/payments/momo/callback`,
      callbackPayload,
    );
    console.log('✅ Callback Processed:', callbackResponse.data);

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   Bill Request ID:', billRequestId);
    console.log('   Payment ID:', acceptResponse.data.payment_id);
    console.log('   Status: Completed ✅');
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function testCashFlow() {
  console.log('🧪 ============ CASH PAYMENT TEST ============\n');

  try {
    // Step 1: Create Bill Request
    console.log('1️⃣ Creating bill request for cash payment...');
    const billResponse = await axios.post(
      `${BASE_URL}/bill-requests`,
      {
        table_id: CONFIG.tableId,
        payment_method: 'cash',
        tips_amount: 20000,
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.customerToken}` },
      },
    );
    console.log('✅ Bill Request Created:', billResponse.data.id);
    const billRequestId = billResponse.data.id;
    const totalAmount = billResponse.data.total_amount;

    // Step 2: Waiter Accept
    console.log('\n2️⃣ Waiter accepting bill request...');
    const acceptResponse = await axios.post(
      `${BASE_URL}/bill-requests/${billRequestId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${CONFIG.waiterToken}` },
      },
    );
    console.log('✅ Payment Created:', acceptResponse.data.payment_id);

    // Step 3: Waiter Confirm Cash Payment
    console.log('\n3️⃣ Waiter confirming cash payment...');
    const confirmResponse = await axios.post(
      `${BASE_URL}/payments/cash/confirm`,
      {
        payment_id: acceptResponse.data.payment_id,
        received_amount: totalAmount + 50000, // Customer gave more
        waiter_id: 'waiter-uuid',
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.waiterToken}` },
      },
    );
    console.log('✅ Cash Confirmed:', confirmResponse.data);
    console.log('   Change:', confirmResponse.data.change_amount);

    console.log('\n🎉 Cash payment test completed!');
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

async function testFailedPayment() {
  console.log('🧪 ============ FAILED PAYMENT TEST ============\n');

  try {
    // Create bill request and accept (same as success flow)
    const billResponse = await axios.post(
      `${BASE_URL}/bill-requests`,
      {
        table_id: CONFIG.tableId,
        payment_method: 'momo',
        tips_amount: 0,
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.customerToken}` },
      },
    );
    const billRequestId = billResponse.data.id;

    const acceptResponse = await axios.post(
      `${BASE_URL}/bill-requests/${billRequestId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${CONFIG.waiterToken}` },
      },
    );

    // Simulate FAILED callback
    console.log('\n🔴 Simulating MoMo callback (FAILED)...');
    const callbackPayload = {
      orderId: acceptResponse.data.payment_id,
      requestId: acceptResponse.data.transaction_id,
      amount: acceptResponse.data.total_amount,
      transId: `FAILED-${Date.now()}`,
      resultCode: 1004, // Error code
      message: 'Payment cancelled by user',
      signature: 'test-signature',
    };

    const callbackResponse = await axios.post(
      `${BASE_URL}/payments/momo/callback`,
      callbackPayload,
    );
    console.log('✅ Failed callback processed:', callbackResponse.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// === RUN TESTS ===
async function runAllTests() {
  console.log('🚀 Starting Payment System Tests...\n');
  console.log('⚙️  Make sure:');
  console.log('   1. Backend is running on http://localhost:3000');
  console.log('   2. PAYMENT_TEST_MODE=true in .env');
  console.log('   3. You have valid tokens and IDs in CONFIG\n');

  await testMoMoFlow();
  console.log('\n' + '='.repeat(50) + '\n');

  await testCashFlow();
  console.log('\n' + '='.repeat(50) + '\n');

  await testFailedPayment();
}

// Check if required config is set
if (!CONFIG.customerToken || CONFIG.customerToken.includes('your-')) {
  console.error('❌ Please update CONFIG with your test tokens and IDs!');
  process.exit(1);
}

runAllTests();
