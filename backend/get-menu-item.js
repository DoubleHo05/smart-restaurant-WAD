/**
 * 🔍 GET MENU ITEM HELPER
 * Chạy: node get-menu-item.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const RESTAURANT_ID = 'YOUR_RESTAURANT_UUID'; // Lấy từ Supabase

async function getMenuItems() {
  console.log('🔍 Getting menu items...\n');

  try {
    // Get menu items (public endpoint)
    const response = await axios.get(
      `${BASE_URL}/menu/restaurant/${RESTAURANT_ID}/items`,
    );

    if (response.data.length === 0) {
      console.error('❌ No menu items found!');
      process.exit(1);
    }

    const firstItem = response.data[0];
    console.log('✅ Found menu items!');
    console.log('   First Item ID:', firstItem.id);
    console.log('   Name:', firstItem.name);
    console.log('   Price:', firstItem.price);

    console.log('\n📋 USE THIS IN test-vnpay-complete.js:');
    console.log(`menuItemId: '${firstItem.id}',`);
    console.log(`restaurantId: '${RESTAURANT_ID}',`);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error(
      '\n💡 Tip: Get restaurant ID from Supabase restaurants table',
    );
    process.exit(1);
  }
}

if (RESTAURANT_ID.includes('YOUR_')) {
  console.error('❌ Please update RESTAURANT_ID in script!');
  console.error('   Get from Supabase: SELECT id FROM restaurants LIMIT 1');
  process.exit(1);
}

getMenuItems();
