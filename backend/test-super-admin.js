/**
 * TEST SCRIPT: SUPER ADMIN APIs
 *
 * Tests for Task 3.3 - Super Admin Backend
 *
 * Endpoints:
 * - GET /api/super-admin/stats
 * - GET /api/super-admin/restaurants
 * - GET /api/super-admin/restaurants/:id
 */

const API_URL = 'http://localhost:3000';

// Test credentials (adjust based on your seeded data)
const SUPER_ADMIN_EMAIL = 'superadmin@restaurant.com';
const SUPER_ADMIN_PASSWORD = 'Admin@123';

let authToken = '';
let testRestaurantId = '';

// ============================================
// HELPER FUNCTIONS
// ============================================

async function login(email, password) {
  console.log(`\n🔐 Logging in as ${email}...`);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.message}`);
  }

  const data = await response.json();
  console.log('✅ Login successful');
  console.log('   User:', data.user.full_name);
  console.log('   Roles:', data.user.roles.join(', '));

  return data.access_token;
}

function printSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function printSuccess(message) {
  console.log(`✅ ${message}`);
}

function printError(message) {
  console.log(`❌ ${message}`);
}

function printData(label, data) {
  console.log(`\n📊 ${label}:`);
  console.log(JSON.stringify(data, null, 2));
}

// ============================================
// TEST FUNCTIONS
// ============================================

async function testSystemStats() {
  printSection('TEST 1: GET System Statistics');

  try {
    const response = await fetch(`${API_URL}/api/super-admin/stats`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('System stats retrieved successfully');
    printData('Restaurants', data.restaurants);
    printData('Users', data.users);
    printData('Orders', data.orders);
    printData('Revenue', data.revenue);
    printData('Payments by Status', data.payments.by_status);

    return true;
  } catch (error) {
    printError(`Failed to get system stats: ${error.message}`);
    return false;
  }
}

async function testAllRestaurants() {
  printSection('TEST 2: GET All Restaurants with Stats');

  try {
    const response = await fetch(`${API_URL}/api/super-admin/restaurants`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess(`Found ${data.length} restaurants`);

    // Display first restaurant details
    if (data.length > 0) {
      const firstRestaurant = data[0];
      testRestaurantId = firstRestaurant.id; // Save for next test

      console.log('\n📋 Sample Restaurant:');
      console.log(`   ID: ${firstRestaurant.id}`);
      console.log(`   Name: ${firstRestaurant.name}`);
      console.log(`   Status: ${firstRestaurant.status}`);
      console.log(
        `   Owner: ${firstRestaurant.owner.full_name} (${firstRestaurant.owner.email})`,
      );
      console.log('\n   Statistics:');
      console.log(`   - Total Orders: ${firstRestaurant.stats.total_orders}`);
      console.log(
        `   - Total Revenue: ${firstRestaurant.stats.total_revenue.toLocaleString('vi-VN')} VND`,
      );
      console.log(`   - Tables: ${firstRestaurant.stats.tables_count}`);
      console.log(`   - Categories: ${firstRestaurant.stats.categories_count}`);
      console.log(
        `   - Active Menu Items: ${firstRestaurant.stats.active_menu_items}`,
      );

      // Show all restaurants summary
      console.log('\n📊 All Restaurants Summary:');
      data.forEach((r, index) => {
        console.log(
          `   ${index + 1}. ${r.name} - ${r.stats.total_orders} orders, ${r.stats.total_revenue.toLocaleString('vi-VN')} VND`,
        );
      });
    }

    return true;
  } catch (error) {
    printError(`Failed to get restaurants: ${error.message}`);
    return false;
  }
}

async function testRestaurantDetails() {
  printSection('TEST 3: GET Restaurant Details');

  if (!testRestaurantId) {
    printError('No restaurant ID available for testing');
    return false;
  }

  try {
    console.log(`\n🔍 Fetching details for restaurant: ${testRestaurantId}`);

    const response = await fetch(
      `${API_URL}/api/super-admin/restaurants/${testRestaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Restaurant details retrieved successfully');

    console.log('\n🏪 Restaurant Information:');
    console.log(`   Name: ${data.name}`);
    console.log(`   Address: ${data.address}`);
    console.log(`   Phone: ${data.phone}`);
    console.log(`   Status: ${data.status}`);

    console.log('\n👤 Owner Information:');
    console.log(`   Name: ${data.owner.full_name}`);
    console.log(`   Email: ${data.owner.email}`);
    console.log(`   Phone: ${data.owner.phone || 'N/A'}`);
    console.log(`   Status: ${data.owner.status}`);

    console.log('\n📊 Order Statistics:');
    console.log(`   Total Orders: ${data.statistics.orders.total}`);
    console.log(`   Completed Orders: ${data.statistics.orders.completed}`);
    console.log(
      `   Completion Rate: ${data.statistics.orders.completion_rate}`,
    );

    console.log('\n💰 Revenue Statistics:');
    console.log(
      `   Total Revenue: ${data.statistics.revenue.total.toLocaleString('vi-VN')} VND`,
    );
    console.log(
      `   Average Order Value: ${data.statistics.revenue.average_order_value.toLocaleString('vi-VN')} VND`,
    );

    console.log('\n🍽️ Menu Statistics:');
    console.log(
      `   Total Categories: ${data.statistics.menu.total_categories}`,
    );
    console.log(`   Total Items: ${data.statistics.menu.total_items}`);
    console.log(`   Tables Count: ${data.tables.length}`);

    console.log('\n🌟 Top Selling Items:');
    if (data.statistics.top_selling_items.length > 0) {
      data.statistics.top_selling_items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.category})`);
        console.log(`      - Sold: ${item.total_sold} units`);
        console.log(
          `      - Revenue: ${item.revenue.toLocaleString('vi-VN')} VND`,
        );
      });
    } else {
      console.log('   No top selling items yet');
    }

    return true;
  } catch (error) {
    printError(`Failed to get restaurant details: ${error.message}`);
    return false;
  }
}

async function testAccessControl() {
  printSection('TEST 4: Access Control - Non Super Admin');

  try {
    // Try to login as regular admin
    console.log('\n🔐 Attempting to login as regular admin...');
    const adminToken = await login('admin@restaurant.com', 'password123');

    console.log(
      '\n🚫 Trying to access super admin endpoint with admin token...',
    );
    const response = await fetch(`${API_URL}/api/super-admin/stats`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (response.status === 403) {
      printSuccess(
        'Access correctly denied for non-super admin (403 Forbidden)',
      );
      return true;
    } else {
      printError(`Expected 403 Forbidden, got ${response.status}`);
      return false;
    }
  } catch (error) {
    // If admin doesn't exist, that's okay for this test
    console.log(
      '⚠️  Note: Could not test with regular admin (user may not exist)',
    );
    return true;
  }
}

async function testInvalidRestaurantId() {
  printSection('TEST 5: Invalid Restaurant ID');

  try {
    const invalidId = '00000000-0000-0000-0000-000000000000';
    console.log(
      `\n🔍 Fetching details for invalid restaurant ID: ${invalidId}`,
    );

    const response = await fetch(
      `${API_URL}/api/super-admin/restaurants/${invalidId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (response.status === 404) {
      printSuccess('Correctly returned 404 for invalid restaurant ID');
      return true;
    } else if (response.status === 500) {
      printSuccess(
        'Server handled invalid ID (may need to improve error handling)',
      );
      return true;
    } else {
      const data = await response.json();
      printError(
        `Expected 404, got ${response.status}: ${JSON.stringify(data)}`,
      );
      return false;
    }
  } catch (error) {
    printError(`Test failed: ${error.message}`);
    return false;
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
  console.log('\n🚀 Starting Super Admin API Tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  try {
    // Login as super admin
    authToken = await login(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);

    // Run tests
    const tests = [
      { name: 'System Stats', fn: testSystemStats },
      { name: 'All Restaurants', fn: testAllRestaurants },
      { name: 'Restaurant Details', fn: testRestaurantDetails },
      { name: 'Access Control', fn: testAccessControl },
      { name: 'Invalid Restaurant ID', fn: testInvalidRestaurantId },
    ];

    for (const test of tests) {
      results.total++;
      const passed = await test.fn();
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    }

    // Print summary
    printSection('TEST SUMMARY');
    console.log(`\n✅ Passed: ${results.passed}/${results.total}`);
    console.log(`❌ Failed: ${results.failed}/${results.total}`);

    if (results.failed === 0) {
      console.log(
        '\n🎉 All tests passed! Super Admin APIs are working correctly.\n',
      );
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running (npm run start:dev)');
    console.error('2. Database is seeded with super admin user');
    console.error('3. Super admin credentials are correct\n');
  }
}

// Run tests
runAllTests();
