/**
 * Test WebSocket Connection Script
 *
 * Usage:
 * 1. Make sure backend is running: npm run start:dev
 * 2. Run this script: node test-socket-connection.js
 */

const io = require('socket.io-client');

// ========================================
// CONFIGURATION
// ========================================

const BACKEND_URL = 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api`;
const SOCKET_URL = `${BACKEND_URL}/notifications`;

// Test credentials (create these users first using Prisma seed or registration)
const TEST_USER = {
  email: 'admin@restaurant.com',
  password: 'Admin@123',
};

// ========================================
// STEP 1: LOGIN TO GET JWT TOKEN
// ========================================

async function login() {
  console.log('🔐 Step 1: Logging in...');

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });

    if (!response.ok) {
      throw new Error(
        `Login failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log('✅ Login successful!');
    console.log('   User:', data.user.email);
    console.log('   Roles:', data.user.roles);
    console.log('   Token:', data.access_token.substring(0, 50) + '...');

    return data.access_token;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.log('\n💡 Make sure you have created a test user:');
    console.log('   - Run: npm run seed (in backend folder)');
    console.log('   - Or register via: POST /api/auth/register');
    process.exit(1);
  }
}

// ========================================
// STEP 2: CONNECT TO WEBSOCKET
// ========================================

function connectToSocket(token) {
  console.log('\n🔌 Step 2: Connecting to WebSocket...');

  const socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection established
  socket.on('connect', () => {
    console.log('✅ WebSocket connected!');
    console.log('   Socket ID:', socket.id);
    console.log('\n✨ Listening for notifications...\n');

    // Test ping/pong
    socket.emit('ping', (response) => {
      console.log('🏓 Ping test:', response);
    });
  });

  // Connection error
  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
    console.log('💡 Check if:');
    console.log('   - Backend is running (npm run start:dev)');
    console.log('   - NotificationsGateway is properly configured');
    console.log('   - JWT token is valid');
  });

  // Disconnected
  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
  });

  // Listen to notification events
  socket.on('new_order', (data) => {
    console.log('📦 NEW ORDER NOTIFICATION:');
    console.log('   Message:', data.message);
    console.log('   Order:', data.data.order_number);
    console.log('   Table:', data.data.table_number);
    console.log('   Total:', data.data.total);
    console.log('');
  });

  socket.on('order_accepted', (data) => {
    console.log('✅ ORDER ACCEPTED NOTIFICATION:');
    console.log('   Message:', data.message);
    console.log('   Order:', data.data.order_number);
    console.log('');
  });

  socket.on('order_ready', (data) => {
    console.log('🍽️  ORDER READY NOTIFICATION:');
    console.log('   Message:', data.message);
    console.log('   Order:', data.data.order_number);
    console.log('');
  });

  socket.on('order_status_update', (data) => {
    console.log('🔄 ORDER STATUS UPDATE:');
    console.log('   Status:', data.status);
    console.log('   Message:', data.message);
    console.log('');
  });

  socket.on('order_rejected', (data) => {
    console.log('❌ ORDER REJECTED:');
    console.log('   Message:', data.message);
    console.log('   Reason:', data.data.reason);
    console.log('');
  });

  return socket;
}

// ========================================
// MAIN EXECUTION
// ========================================

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  WebSocket Connection Test');
  console.log('═══════════════════════════════════════\n');

  try {
    // Step 1: Login to get token
    const token = await login();

    // Step 2: Connect to WebSocket
    const socket = connectToSocket(token);

    // Keep the script running
    console.log('📡 Script is running. Press Ctrl+C to exit.\n');
    console.log('💡 Now create an order in another terminal or browser');
    console.log('   to see real-time notifications here!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
main();
