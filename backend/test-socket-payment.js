/**
 * 🧪 Test Socket.IO Payment Notifications
 * Test real-time notifications cho waiters và customers
 */

const io = require('socket.io-client');
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';
const SOCKET_URL = 'http://localhost:3000/notifications';

// Tokens from get-tokens.js
const TOKENS = {
  customer:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDk4NTAxMC03ZWUzLTQwNGQtOTMwNy0wNDc3MTc5MzgyMjUiLCJlbWFpbCI6ImN1c3RvbWVyQHRlc3QuY29tIiwicm9sZXMiOlsiY3VzdG9tZXIiXSwiaWF0IjoxNzY4MzkyMTMyLCJleHAiOjE3Njg5OTY5MzJ9.p4_nSi4WljUk4TJpgqLhdsztVpZP3ATsk5WbPi0AHOM',
  waiter:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTg4YzMxYy0zM2YwLTRiYjgtYjk5OS04OTcwNGM2ZmRkNzUiLCJlbWFpbCI6IndhaXRlckB0ZXN0LmNvbSIsInJvbGVzIjpbIndhaXRlciJdLCJpYXQiOjE3NjgzOTIxMzMsImV4cCI6MTc2ODk5NjkzM30.Co9MFjoxPi1fMtSUCbwho6IudNTeL4H5P85Kf71o0ec',
};

const TABLE_ID = '832d2ddd-ffb2-432d-820e-af86eddc0f63';

// Connect waiter socket
const waiterSocket = io(SOCKET_URL, {
  auth: { token: TOKENS.waiter },
  transports: ['websocket'],
});

// Connect customer socket  
const customerSocket = io(SOCKET_URL, {
  auth: { token: TOKENS.customer },
  transports: ['websocket'],
});

let receivedNotifications = [];

waiterSocket.on('connect', () => {
  console.log('✅ Waiter socket connected:', waiterSocket.id);
});

waiterSocket.on('bill_request_created', (data) => {
  console.log('\n🔔 [WAITER] Bill Request Created:');
  console.log(JSON.stringify(data, null, 2));
  receivedNotifications.push({ role: 'waiter', event: 'bill_request_created', data });
});

waiterSocket.on('payment_completed', (data) => {
  console.log('\n🎉 [WAITER] Payment Completed:');
  console.log(JSON.stringify(data, null, 2));
  receivedNotifications.push({ role: 'waiter', event: 'payment_completed', data });
});

waiterSocket.on('payment_failed', (data) => {
  console.log('\n❌ [WAITER] Payment Failed:');
  console.log(JSON.stringify(data, null, 2));
  receivedNotifications.push({ role: 'waiter', event: 'payment_failed', data });
});

customerSocket.on('connect', () => {
  console.log('✅ Customer socket connected:', customerSocket.id);
  console.log('\n📡 Listening for notifications...\n');
  
  // Start payment flow after sockets connected
  setTimeout(startPaymentFlow, 2000);
});

customerSocket.on('payment_completed', (data) => {
  console.log('\n🎉 [CUSTOMER] Payment Completed:');
  console.log(JSON.stringify(data, null, 2));
  receivedNotifications.push({ role: 'customer', event: 'payment_completed', data });
});

customerSocket.on('payment_failed', (data) => {
  console.log('\n❌ [CUSTOMER] Payment Failed:');
  console.log(JSON.stringify(data, null, 2));
  receivedNotifications.push({ role: 'customer', event: 'payment_failed', data });
});

waiterSocket.on('connect_error', (error) => {
  console.error('❌ Waiter connection error:', error.message);
});

customerSocket.on('connect_error', (error) => {
  console.error('❌ Customer connection error:', error.message);
});

async function startPaymentFlow() {
  console.log('🚀 Starting payment flow...\n');

  try {
    // 1. Customer creates bill request
    console.log('1️⃣  Customer creating bill request...');
    const billResponse = await axios.post(
      `${BACKEND_URL}/bill-requests`,
      {
        table_id: TABLE_ID,
        payment_method: 'vnpay',
        tips_amount: 30000,
        customer_note: 'Test Socket.IO notifications',
      },
      {
        headers: { Authorization: `Bearer ${TOKENS.customer}` },
      },
    );

    console.log('✅ Bill Request Created:', billResponse.data.id);
    const billRequestId = billResponse.data.id;

    // Wait for notification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Waiter accepts bill request
    console.log('\n2️⃣  Waiter accepting bill request...');
    const acceptResponse = await axios.post(
      `${BACKEND_URL}/bill-requests/${billRequestId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${TOKENS.waiter}` },
      },
    );

    console.log('✅ Payment Created:', acceptResponse.data.payment_id);
    console.log('   Payment URL:', acceptResponse.data.payment_url);

    // 3. Wait for user to complete payment
    console.log('\n3️⃣  Please complete payment:');
    console.log('   1. Open payment URL in browser');
    console.log('   2. Complete payment with VNPay test card');
    console.log('   3. After redirect, copy the FULL URL from browser');
    console.log('   4. Paste it here and press Enter\n');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Paste return URL here: ', async (returnUrl) => {
      rl.close();
      
      try {
        console.log('\n4️⃣  Processing payment return...');
        
        // Call backend return endpoint
        const response = await axios.get(returnUrl.replace('http://localhost:5173/payment/result', `${BACKEND_URL}/payments/vnpay/return`));
        
        if (response.data.success) {
          console.log('✅ Payment verified successfully!');
          console.log('   Waiting for socket notifications...');
          
          // Wait for socket notifications
          setTimeout(showSummary, 3000);
        } else {
          console.log('❌ Payment verification failed:', response.data);
          showSummary();
        }
      } catch (error) {
        console.error('❌ Error processing return:', error.message);
        showSummary();
      }
    });
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

function showSummary() {
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 NOTIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total notifications received: ${receivedNotifications.length}\n`);

  if (receivedNotifications.length === 0) {
    console.log('❌ No notifications received!');
    console.log('   Check:');
    console.log('   - Backend Socket.IO is running');
    console.log('   - Tokens are valid');
    console.log('   - NotificationsGateway is integrated');
  } else {
    receivedNotifications.forEach((notif, i) => {
      console.log(`${i + 1}. [${notif.role.toUpperCase()}] ${notif.event}`);
      console.log(`   Message: ${notif.data.message || notif.data.title}`);
    });
    console.log('\n✅ Socket.IO notifications working!');
  }

  console.log('='.repeat(60));
  
  // Disconnect
  waiterSocket.disconnect();
  customerSocket.disconnect();
  
  setTimeout(() => process.exit(0), 1000);
}

console.log('🧪 Socket.IO Payment Notification Test');
console.log('=====================================\n');
console.log('📡 Connecting sockets...');
