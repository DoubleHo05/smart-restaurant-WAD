/**
 * 🔐 GET TOKENS HELPER (Simple Version)
 * Chạy: node get-tokens-simple.js
 * Chỉ get tokens, không check tables
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
    console.log('✅ Customer Token:', customerToken.substring(0, 20) + '...');

    // Login as waiter
    console.log('\n2️⃣  Login as waiter...');
    const waiterResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'waiter@test.com',
      password: 'password123',
    });
    const waiterToken = waiterResponse.data.access_token;
    console.log('✅ Waiter Token:', waiterToken.substring(0, 20) + '...');

    // Output config
    console.log('\n' + '='.repeat(60));
    console.log('📋 COPY THIS TO test-vnpay.js CONFIG:');
    console.log('='.repeat(60));
    console.log(`
const CONFIG = {
  customerToken: '${customerToken}',
  waiterToken: '${waiterToken}',
  tableId: '020dd679-31da-497e-e6-df-d7f4b0a0d493', // Table T05 (from Supabase)
};
`);
    console.log('='.repeat(60));
    console.log('\n💡 Tip: Change tableId to any table UUID from Supabase');
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error('\n💡 Invalid credentials. Check:');
      console.error('   - Email: customer@test.com / waiter@test.com');
      console.error('   - Password: Test123! / password123');
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Backend not running!');
      console.error('   Run: npm run start:dev');
    }

    process.exit(1);
  }
}

getTokens();
