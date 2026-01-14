/**
 * 🔐 GET TOKENS HELPER
 * Chạy: node get-tokens.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function getTokens() {
  console.log('🔐 Getting authentication tokens...\n');

  try {
    // Login as customer
    console.log('1️⃣  Login as customer...');
    const customerResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'customer@test.com',
      password: 'Test123!',
    });
    const customerToken = customerResponse.data.access_token;
    console.log('✅ Customer Token:', customerToken);

    // Login as waiter
    console.log('\n2️⃣  Login as waiter...');
    const waiterResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'waiter@test.com',
      password: 'password123',
    });
    const waiterToken = waiterResponse.data.access_token;
    console.log('✅ Waiter Token:', waiterToken);

    // Get table ID
    // console.log('\n3️⃣  Getting table ID...');
    // const tablesResponse = await axios.get(`${BASE_URL}/tables`, {
    //   headers: { Authorization: `Bearer ${waiterToken}` },
    // });

    // console.log('   Response:', tablesResponse.data);

    // if (!tablesResponse.data || tablesResponse.data.length === 0) {
    //   console.error('❌ No tables found!');
    //   console.error('\n💡 Solutions:');
    //   console.error('   1. Check if waiter user has access to restaurant');
    //   console.error('   2. Make sure tables exist in database');
    //   console.error('   3. Check waiter role permissions');
    //   console.error('\n📊 Response:', JSON.stringify(tablesResponse.data, null, 2));
    //   process.exit(1);
    // }

    const tableId = '020d6d73-3fde-497e-a5c5-cd740ab2c009';
    const tableNumber = 'T06';
    console.log(`✅ Table ID: ${tableId} (Table ${tableNumber})`);

    // Output config
    console.log('\n' + '='.repeat(60));
    console.log('📋 COPY THIS TO test-vnpay.js CONFIG:');
    console.log('='.repeat(60));
    console.log(`
const CONFIG = {
  customerToken: '${customerToken}',
  waiterToken: '${waiterToken}',
  tableId: '${tableId}', // Table ${tableNumber}
};
`);
    console.log('='.repeat(60));
    console.log('\n💡 OR use any table ID from database:');
    console.log('   Example: 020dd679-31da-497e-e6-df-d7f4b0a0d493');
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error('\n💡 Tip: Make sure you have test users in database:');
      console.error('   Email: customer@test.com, Password: password123');
      console.error('   Email: waiter@test.com, Password: password123');
    }

    if (error.code === 'ECONNREFUSED') {
      console.error(
        '\n💡 Tip: Make sure backend is running on http://localhost:3000',
      );
      console.error('   Run: npm run start:dev');
    }

    process.exit(1);
  }
}

getTokens();
