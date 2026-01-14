/**
 * Test VNPay signature generation
 * So sánh với tool: https://www.liavaag.org/English/SHA-Generator/HMAC/
 */

const crypto = require('crypto');

const hashSecret = 'S6QZSNLZ9VXQMEWT6HWNBVIF00E2PFJJ';
const signData =
  'vnp_Amount=10150220&vnp_Command=pay&vnp_CreateDate=20260114191640&vnp_CurrCode=VND&vnp_ExpireDate=20260114193140&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Bill 5adfd2fe-9a4d-406d-a0d5-25fede58bc8e&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:5173/payment/result&vnp_TmnCode=XTVTHSVS&vnp_TxnRef=8e3f4ea7-2288-4e9d-89b4-369355dd7ed6&vnp_Version=2.1.0';

const hash = crypto
  .createHmac('sha512', hashSecret)
  .update(signData)
  .digest('hex');

console.log('📝 Sign Data:');
console.log(signData);
console.log('\n🔐 Hash Secret:');
console.log(hashSecret);
console.log('\n✅ Generated Hash:');
console.log(hash);
console.log('\n🎯 Expected from backend log:');
console.log(
  '24deb73240f54ade274269998666410542c21bb1e09d7dddbc02dab7b07f23714ae0d6834403dceab4b25ef966221ddbf267b2248a7e2967bfb4a41306a1e6ed',
);
console.log(
  '\n📊 Match:',
  hash ===
    '24deb73240f54ade274269998666410542c21bb1e09d7dddbc02dab7b07f23714ae0d6834403dceab4b25ef966221ddbf267b2248a7e2967bfb4a41306a1e6ed'
    ? '✅ YES'
    : '❌ NO',
);
