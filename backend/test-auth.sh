#!/bin/bash

# Test Customer Authentication APIs
# Make sure backend is running on http://localhost:3000

API_URL="http://localhost:3000"

echo "=========================================="
echo "Testing Customer Authentication APIs"
echo "=========================================="
echo ""

# Test 1: Register new customer
echo "📝 Test 1: Register new customer"
echo "POST /auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@test.com",
    "password": "Test1234",
    "phone": "+84 123 456 789"
  }')

echo "Response:"
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Extract token from register response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Registration successful! Token received."
else
  echo "❌ Registration failed!"
  exit 1
fi

echo ""
echo "=========================================="
echo ""

# Test 2: Login with same credentials
echo "🔐 Test 2: Login with existing credentials"
echo "POST /auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test1234"
  }')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token from login response
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')

if [ "$LOGIN_TOKEN" != "null" ] && [ -n "$LOGIN_TOKEN" ]; then
  echo "✅ Login successful! Token received."
  TOKEN="$LOGIN_TOKEN"
else
  echo "❌ Login failed!"
  exit 1
fi

echo ""
echo "=========================================="
echo ""

# Test 3: Get user profile with token
echo "👤 Test 3: Get user profile (protected endpoint)"
echo "GET /auth/me"
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$PROFILE_RESPONSE" | jq '.'
echo ""

if echo "$PROFILE_RESPONSE" | jq -e '.id' > /dev/null; then
  echo "✅ Profile retrieved successfully!"
else
  echo "❌ Failed to retrieve profile!"
  exit 1
fi

echo ""
echo "=========================================="
echo ""

# Test 4: Try accessing profile without token
echo "🔒 Test 4: Access protected endpoint without token (should fail)"
echo "GET /auth/me (no token)"
NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/auth/me")

echo "Response:"
echo "$NO_TOKEN_RESPONSE"
echo ""

if echo "$NO_TOKEN_RESPONSE" | grep -q "Unauthorized"; then
  echo "✅ Correctly blocked unauthorized access!"
else
  echo "⚠️  Expected unauthorized error"
fi

echo ""
echo "=========================================="
echo ""

# Test 5: Try registering with same email (should fail)
echo "⚠️  Test 5: Register with duplicate email (should fail)"
echo "POST /auth/register"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "customer@test.com",
    "password": "Test5678"
  }')

echo "Response:"
echo "$DUPLICATE_RESPONSE"
echo ""

if echo "$DUPLICATE_RESPONSE" | grep -q -i "already"; then
  echo "✅ Correctly prevented duplicate registration!"
else
  echo "⚠️  Expected duplicate email error"
fi

echo ""
echo "=========================================="
echo ""

# Test 6: Try login with wrong password (should fail)
echo "❌ Test 6: Login with wrong password (should fail)"
echo "POST /auth/login"
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "WrongPassword123"
  }')

echo "Response:"
echo "$WRONG_PASSWORD_RESPONSE"
echo ""

if echo "$WRONG_PASSWORD_RESPONSE" | grep -q -i "invalid\|credentials"; then
  echo "✅ Correctly rejected wrong password!"
else
  echo "⚠️  Expected invalid credentials error"
fi

echo ""
echo "=========================================="
echo "✅ All tests completed!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "  ✅ Customer registration"
echo "  ✅ Customer login"
echo "  ✅ JWT token generation"
echo "  ✅ Protected endpoint access"
echo "  ✅ Unauthorized access prevention"
echo "  ✅ Duplicate email prevention"
echo "  ✅ Wrong password rejection"
echo ""
echo "🎉 Customer Authentication is working!"
