#!/bin/bash

# Role Management Integration Test Script
# This script helps test the role management integration

echo "🚀 Role Management Integration Test"
echo "=================================="

# Check if backend is running
echo "📡 Checking backend connection..."
curl -s http://localhost:3000/api/test-roles > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on localhost:3000"
else
    echo "❌ Backend is not running. Please start your backend server first."
    echo "   Make sure your backend is running on http://localhost:3000"
    exit 1
fi

echo ""
echo "🔍 Testing API endpoints..."

# Test role routes
echo "1. Testing role routes..."
curl -s -X GET http://localhost:3000/api/test-roles | jq . || echo "❌ Failed to test role routes"

echo ""
echo "2. Testing get roles..."
curl -s -X GET http://localhost:3000/api/roles | jq . || echo "❌ Failed to get roles"

echo ""
echo "3. Testing get users..."
curl -s -X GET "http://localhost:3000/api/users?limit=5" | jq . || echo "❌ Failed to get users"

echo ""
echo "🎯 Integration Test Complete!"
echo ""
echo "📝 To test the frontend integration:"
echo "   1. Start your React app: npm run dev"
echo "   2. Visit http://localhost:5173/role-test"
echo "   3. Test the API endpoints through the UI"
echo "   4. Try updating user roles"
echo ""
echo "🔗 Available Pages:"
echo "   - /role-test (Testing interface)"
echo "   - /role-settings (User role management)"
echo "   - /user-management (Admin user management)"
echo ""
echo "✨ Happy testing!"
