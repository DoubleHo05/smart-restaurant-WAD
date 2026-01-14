/**
 * TEST SCRIPT: ADVANCED REPORTS APIs
 *
 * Tests for Task 3.4 - Advanced Reports Backend
 *
 * New Endpoints:
 * - GET /reports/revenue-by-category
 * - GET /reports/waiter-performance
 * - GET /reports/kitchen-efficiency
 * - GET /reports/customer-retention
 * - GET /reports/peak-hours
 */

const API_URL = 'http://localhost:3000';

// Test credentials
const ADMIN_EMAIL = 'admin@restaurant.com';
const ADMIN_PASSWORD = 'Admin@123';

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

  return data.access_token;
}

async function getRestaurantId() {
  const response = await fetch(`${API_URL}/api/admin/restaurants`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to get restaurants');
  }

  const restaurants = await response.json();
  if (restaurants.length === 0) {
    throw new Error('No restaurants found');
  }

  return restaurants[0].id;
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

async function testRevenueByCategory() {
  printSection('TEST 1: Revenue by Category');

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url = `${API_URL}/reports/revenue-by-category?restaurant_id=${testRestaurantId}&start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Revenue by category retrieved successfully');
    console.log(`\n📅 Period: ${data.period.start} to ${data.period.end}`);
    console.log(
      `💰 Total Revenue: ${data.total_revenue.toLocaleString('vi-VN')} VND`,
    );

    if (data.categories.length > 0) {
      console.log(`\n📋 Categories (${data.categories.length}):`);
      data.categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.category}`);
        console.log(
          `      - Revenue: ${cat.revenue.toLocaleString('vi-VN')} VND`,
        );
        console.log(`      - Quantity: ${cat.quantity} items`);
        console.log(`      - Items Count: ${cat.items_count}`);
      });
    } else {
      console.log('⚠️  No category data available');
    }

    return true;
  } catch (error) {
    printError(`Failed: ${error.message}`);
    return false;
  }
}

async function testWaiterPerformance() {
  printSection('TEST 2: Waiter Performance');

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url = `${API_URL}/reports/waiter-performance?restaurant_id=${testRestaurantId}&start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Waiter performance retrieved successfully');
    console.log(`\n📅 Period: ${data.period.start} to ${data.period.end}`);
    console.log(`👥 Total Waiters: ${data.total_waiters}`);
    console.log(
      `💰 Total Revenue: ${data.total_revenue.toLocaleString('vi-VN')} VND`,
    );

    if (data.waiters.length > 0) {
      console.log(`\n🏆 Top Performers:`);
      data.waiters.slice(0, 5).forEach((waiter, index) => {
        console.log(`   ${index + 1}. ${waiter.name}`);
        console.log(`      - Orders: ${waiter.orders}`);
        console.log(
          `      - Revenue: ${waiter.revenue.toLocaleString('vi-VN')} VND`,
        );
        console.log(
          `      - Avg Order Value: ${waiter.avg_order_value.toLocaleString('vi-VN')} VND`,
        );
      });
    } else {
      console.log(
        '⚠️  No waiter data available (orders may not have waiter_id assigned)',
      );
    }

    return true;
  } catch (error) {
    printError(`Failed: ${error.message}`);
    return false;
  }
}

async function testKitchenEfficiency() {
  printSection('TEST 3: Kitchen Efficiency');

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url = `${API_URL}/reports/kitchen-efficiency?restaurant_id=${testRestaurantId}&start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Kitchen efficiency retrieved successfully');
    console.log(`\n📅 Period: ${data.period.start} to ${data.period.end}`);
    console.log(
      `⏱️  Average Prep Time: ${data.average_prep_time_minutes} minutes`,
    );
    console.log(`📦 Total Orders: ${data.total_orders}`);

    if (data.orders_by_prep_time && data.orders_by_prep_time.length > 0) {
      console.log(`\n📊 Orders by Prep Time:`);
      data.orders_by_prep_time.forEach((range) => {
        console.log(`   ${range.range}: ${range.count} orders`);
      });
    }

    return true;
  } catch (error) {
    printError(`Failed: ${error.message}`);
    return false;
  }
}

async function testCustomerRetention() {
  printSection('TEST 4: Customer Retention');

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url = `${API_URL}/reports/customer-retention?restaurant_id=${testRestaurantId}&start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Customer retention retrieved successfully');
    console.log(`\n📅 Period: ${data.period.start} to ${data.period.end}`);

    console.log(`\n📊 Summary:`);
    console.log(`   Total Customers: ${data.summary.total_customers}`);
    console.log(`   New Customers: ${data.summary.new_customers}`);
    console.log(`   Returning Customers: ${data.summary.returning_customers}`);
    console.log(
      `   Loyal Customers (5+ orders): ${data.summary.loyal_customers}`,
    );
    console.log(`   Retention Rate: ${data.summary.retention_rate}`);
    console.log(
      `   Avg Orders per Customer: ${data.average_orders_per_customer}`,
    );

    if (data.top_customers && data.top_customers.length > 0) {
      console.log(`\n🏆 Top 5 Customers:`);
      data.top_customers.slice(0, 5).forEach((customer, index) => {
        console.log(`   ${index + 1}. Customer ID: ${customer.customer_id}`);
        console.log(`      - Orders: ${customer.orders}`);
        console.log(
          `      - Total Spent: ${customer.total_spent.toLocaleString('vi-VN')} VND`,
        );
      });
    }

    return true;
  } catch (error) {
    printError(`Failed: ${error.message}`);
    return false;
  }
}

async function testPeakHours() {
  printSection('TEST 5: Peak Hours Analysis');

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const url = `${API_URL}/reports/peak-hours?restaurant_id=${testRestaurantId}&start_date=${startDate}&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Status: ${response.status}, Message: ${error.message}`);
    }

    const data = await response.json();

    printSuccess('Peak hours analysis retrieved successfully');
    console.log(`\n📅 Period: ${data.period.start} to ${data.period.end}`);

    console.log(`\n🔥 Peak Hour:`);
    console.log(`   Time: ${data.peak_hour.hour}`);
    console.log(`   Orders: ${data.peak_hour.orders}`);
    console.log(
      `   Revenue: ${data.peak_hour.revenue.toLocaleString('vi-VN')} VND`,
    );

    // Show busiest hours
    const busyHours = data.hourly_breakdown
      .filter((h) => h.orders > 0)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    if (busyHours.length > 0) {
      console.log(`\n📊 Top 5 Busiest Hours:`);
      busyHours.forEach((hour, index) => {
        console.log(
          `   ${index + 1}. ${hour.hour} - ${hour.orders} orders, ${hour.revenue.toLocaleString('vi-VN')} VND`,
        );
      });
    }

    return true;
  } catch (error) {
    printError(`Failed: ${error.message}`);
    return false;
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================

async function runAllTests() {
  console.log('\n🚀 Starting Advanced Reports API Tests...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  try {
    // Login
    authToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    // Get restaurant ID
    console.log('\n📍 Fetching restaurant...');
    testRestaurantId = await getRestaurantId();
    console.log(`✅ Using restaurant ID: ${testRestaurantId}`);

    // Run tests
    const tests = [
      { name: 'Revenue by Category', fn: testRevenueByCategory },
      { name: 'Waiter Performance', fn: testWaiterPerformance },
      { name: 'Kitchen Efficiency', fn: testKitchenEfficiency },
      { name: 'Customer Retention', fn: testCustomerRetention },
      { name: 'Peak Hours', fn: testPeakHours },
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
        '\n🎉 All tests passed! Advanced Reports APIs are working correctly.\n',
      );
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running (npm run start:dev)');
    console.error('2. Database has orders with completed status');
    console.error('3. Migration for waiter_id has been run');
    console.error('4. Admin credentials are correct\n');
  }
}

// Run tests
runAllTests();
