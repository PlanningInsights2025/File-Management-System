// Test script for the authentication API
// Run with: node test-auth.js

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing FMS Authentication API\n');
  console.log('='.repeat(50));

  // Test 1: Health Check
  console.log('\n[TEST 1] Health Check');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✓ Server is running');
    console.log('Response:', data);
  } catch (error) {
    console.log('✗ Server is not responding');
    console.log('Error:', error.message);
    console.log('\nMake sure the backend server is running:');
    console.log('  cd backend && npm start');
    return;
  }

  // Test 2: Register New User
  console.log('\n[TEST 2] User Registration');
  const testUser = {
    username: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'test123',
    role: 'user'
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Registration successful');
      console.log('User:', data.user);
      console.log('Token received:', data.token.substring(0, 20) + '...');
    } else {
      console.log('✗ Registration failed');
      console.log('Error:', data.message);
    }
  } catch (error) {
    console.log('✗ Registration error');
    console.log('Error:', error.message);
  }

  // Test 3: Login
  console.log('\n[TEST 3] User Login');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@fms.com',
        password: 'admin123'
      })
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Login successful');
      console.log('User:', data.user);
      console.log('Token received:', data.token.substring(0, 20) + '...');
      
      // Test 4: Get Profile (Protected Route)
      console.log('\n[TEST 4] Get Profile (Protected Route)');
      const profileResponse = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        console.log('✓ Profile retrieved successfully');
        console.log('Profile:', profileData.user);
      } else {
        console.log('✗ Failed to get profile');
        console.log('Error:', profileData.message);
      }
    } else {
      console.log('✗ Login failed');
      console.log('Error:', data.message);
      console.log('\nNote: Make sure you have run the database setup:');
      console.log('  mysql -u root -p fms_db < database/users_table.sql');
    }
  } catch (error) {
    console.log('✗ Login error');
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 API Testing Complete!\n');
}

// Run tests
testAPI();
