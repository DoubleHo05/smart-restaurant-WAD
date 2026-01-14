/**
 * 🧪 Test Payment Records APIs (Task 3.2 - No Refund)
 * Test: List payments, payment detail, analytics
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Get from get-tokens.js
const TOKENS = {
  admin:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYWQwNTgxZi03MDMwLTRlZDQtOTlhMy00YjM3NWEzM2E5YTQiLCJlbWFpbCI6ImFkbWluQHJlc3RhdXJhbnQuY29tIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzY4NDAwNzM1LCJleHAiOjE3NjkwMDU1MzV9.AliE0qbELMPR9SggtJNosBvinh73HiHMqExnpyoRjiE',
  customer:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDk4NTAxMC03ZWUzLTQwNGQtOTMwNy0wNDc3MTc5MzgyMjUiLCJlbWFpbCI6ImN1c3RvbWVyQHRlc3QuY29tIiwicm9sZXMiOlsiY3VzdG9tZXIiXSwiaWF0IjoxNzY4Mzk1NDIwLCJleHAiOjE3NjkwMDAyMjB9.7DuFtNhJkdLALvKfyKSxnbiaBoPnpO_LfcXMcQd70jw',
};

async function testPaymentRecords() {
  console.log('🧪 ============ PAYMENT RECORDS TEST ============\n');

  try {
    // ==========================================
    // TEST 1: List all payments (no filter)
    // ==========================================
    console.log('1️⃣  TEST 1: List all payments (Admin)');
    const listResponse = await axios.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${TOKENS.admin}` },
      params: {
        page: 1,
        limit: 10,
      },
    });

    console.log('✅ Success!');
    console.log(`   Total payments: ${listResponse.data.pagination.total}`);
    console.log(
      `   Page: ${listResponse.data.pagination.page}/${listResponse.data.pagination.total_pages}`,
    );
    console.log(`   Payments returned: ${listResponse.data.payments.length}`);

    if (listResponse.data.payments.length > 0) {
      const firstPayment = listResponse.data.payments[0];
      console.log('\n   First payment:');
      console.log(`   - ID: ${firstPayment.id}`);
      console.log(
        `   - Amount: ${Number(firstPayment.amount).toLocaleString()} VND`,
      );
      console.log(
        `   - Method: ${firstPayment.payment_methods?.name || 'N/A'}`,
      );
      console.log(`   - Status: ${firstPayment.status}`);
      console.log(
        `   - Date: ${new Date(firstPayment.created_at).toLocaleString('vi-VN')}`,
      );
    }

    // ==========================================
    // TEST 2: Filter by status = completed
    // ==========================================
    console.log('\n2️⃣  TEST 2: Filter completed payments');
    const completedResponse = await axios.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${TOKENS.admin}` },
      params: {
        status: 'completed',
        page: 1,
        limit: 5,
      },
    });

    console.log('✅ Success!');
    console.log(
      `   Completed payments: ${completedResponse.data.pagination.total}`,
    );

    // ==========================================
    // TEST 3: Filter by payment method
    // ==========================================
    console.log('\n3️⃣  TEST 3: Filter by method (vnpay)');
    const vnpayResponse = await axios.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${TOKENS.admin}` },
      params: {
        method: 'vnpay',
        page: 1,
        limit: 5,
      },
    });

    console.log('✅ Success!');
    console.log(`   VNPay payments: ${vnpayResponse.data.pagination.total}`);

    // ==========================================
    // TEST 4: Get payment detail
    // ==========================================
    if (listResponse.data.payments.length > 0) {
      const paymentId = listResponse.data.payments[0].id;
      console.log(`\n4️⃣  TEST 4: Get payment detail (${paymentId})`);

      const detailResponse = await axios.get(
        `${BASE_URL}/payments/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${TOKENS.customer}` },
        },
      );

      console.log('✅ Success!');
      console.log('   Payment details:');
      console.log(`   - ID: ${detailResponse.data.id}`);
      console.log(
        `   - Amount: ${Number(detailResponse.data.amount).toLocaleString()} VND`,
      );
      console.log(
        `   - Method: ${detailResponse.data.payment_methods?.name || 'N/A'}`,
      );
      console.log(`   - Status: ${detailResponse.data.status}`);
      console.log(
        `   - Table: ${detailResponse.data.bill_requests?.tables?.table_number || 'N/A'}`,
      );

      if (detailResponse.data.users_payments_received_byTousers) {
        console.log(
          `   - Received by: ${detailResponse.data.users_payments_received_byTousers.full_name || 'N/A'}`,
        );
      }

      if (detailResponse.data.orders?.length > 0) {
        console.log(`   - Orders: ${detailResponse.data.orders.length}`);
      }
    }

    // ==========================================
    // TEST 5: Analytics - Revenue by method
    // ==========================================
    console.log('\n5️⃣  TEST 5: Analytics - Revenue by method');
    const startDate = '2026-01-01';
    const endDate = '2026-01-31';

    const revenueResponse = await axios.get(
      `${BASE_URL}/payments/analytics/revenue-by-method`,
      {
        headers: { Authorization: `Bearer ${TOKENS.admin}` },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      },
    );

    console.log('✅ Success!');
    console.log(`   Period: ${startDate} to ${endDate}`);
    console.log(
      `   Total Revenue: ${revenueResponse.data.total_revenue.toLocaleString()} VND`,
    );
    console.log(
      `   Total Transactions: ${revenueResponse.data.total_transactions}`,
    );
    console.log('\n   Breakdown by method:');

    revenueResponse.data.methods.forEach((method) => {
      console.log(`   - ${method.method}:`);
      console.log(
        `     Revenue: ${method.revenue.toLocaleString()} VND (${method.transactions} transactions)`,
      );
      console.log(
        `     Avg: ${method.avg_transaction.toLocaleString()} VND/transaction`,
      );
    });

    // ==========================================
    // TEST 6: Analytics - Success rate
    // ==========================================
    console.log('\n6️⃣  TEST 6: Analytics - Success rate by method');
    const successResponse = await axios.get(
      `${BASE_URL}/payments/analytics/success-rate`,
      {
        headers: { Authorization: `Bearer ${TOKENS.admin}` },
      },
    );

    console.log('✅ Success!');
    console.log('   Overall stats:');
    console.log(
      `   - Total: ${successResponse.data.overall.total_payments} payments`,
    );
    console.log(
      `   - Completed: ${successResponse.data.overall.completed} (${((successResponse.data.overall.completed / successResponse.data.overall.total_payments) * 100).toFixed(1)}%)`,
    );
    console.log(
      `   - Failed: ${successResponse.data.overall.failed} (${((successResponse.data.overall.failed / successResponse.data.overall.total_payments) * 100).toFixed(1)}%)`,
    );
    console.log(`   - Pending: ${successResponse.data.overall.pending}`);

    console.log('\n   Success rate by method:');
    successResponse.data.methods.forEach((method) => {
      const statusIcon =
        method.success_rate > 95
          ? '✅'
          : method.success_rate > 90
            ? '⚠️'
            : '❌';
      console.log(
        `   ${statusIcon} ${method.method}: ${method.success_rate.toFixed(1)}% (${method.success}/${method.success + method.failed})`,
      );
    });

    // ==========================================
    // TEST 7: Search functionality
    // ==========================================
    if (listResponse.data.payments.length > 0) {
      const searchId = listResponse.data.payments[0].id.substring(0, 8);
      console.log(`\n7️⃣  TEST 7: Search by payment ID (${searchId}...)`);

      const searchResponse = await axios.get(`${BASE_URL}/payments`, {
        headers: { Authorization: `Bearer ${TOKENS.admin}` },
        params: {
          search: searchId,
          page: 1,
          limit: 5,
        },
      });

      console.log('✅ Success!');
      console.log(`   Found: ${searchResponse.data.payments.length} payments`);
    }

    // ==========================================
    // TEST 8: Date range filter
    // ==========================================
    console.log('\n8️⃣  TEST 8: Filter by date range (today)');
    const today = new Date().toISOString().split('T')[0];

    const dateRangeResponse = await axios.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${TOKENS.admin}` },
      params: {
        start_date: today,
        end_date: today,
        page: 1,
        limit: 10,
      },
    });

    console.log('✅ Success!');
    console.log(
      `   Payments today: ${dateRangeResponse.data.pagination.total}`,
    );

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ All 8 tests passed!');
    console.log('\nFeatures tested:');
    console.log('  1. ✅ List payments (pagination)');
    console.log('  2. ✅ Filter by status');
    console.log('  3. ✅ Filter by payment method');
    console.log('  4. ✅ Get payment detail');
    console.log('  5. ✅ Revenue analytics by method');
    console.log('  6. ✅ Success rate analytics');
    console.log('  7. ✅ Search functionality');
    console.log('  8. ✅ Date range filter');
    console.log('\n✅ Task 3.2 (Payment Records - No Refund) working!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status Code:', error.response.status);
      console.error('   URL:', error.config.url);
    }
    process.exit(1);
  }
}

// ==========================================
// RUN TEST
// ==========================================
async function runTest() {
  console.log('🚀 Payment Records API Test\n');
  console.log('📋 Prerequisites:');
  console.log('   ✅ Backend running on http://localhost:3000');
  console.log('   ✅ Admin token configured');
  console.log('   ✅ At least 1 payment in database\n');

  // Check tokens
  if (TOKENS.admin.includes('REPLACE')) {
    console.error('❌ Please update TOKENS with your admin token!');
    console.error('   Get token by: POST /auth/login');
    process.exit(1);
  }

  await testPaymentRecords();
}

runTest();
