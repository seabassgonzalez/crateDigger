import fetch from 'node-fetch';

async function testAuthFlow() {
  const baseUrl = 'http://localhost:3001/api';
  
  try {
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sg@sg.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status, await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json() as any;
    console.log('Login successful!');
    console.log('Token:', loginData.token);
    console.log('User:', loginData.user);

    const token = loginData.token;

    // Test /me endpoint
    console.log('\n2. Testing /auth/me endpoint...');
    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!meResponse.ok) {
      console.error('Me endpoint failed:', meResponse.status, await meResponse.text());
    } else {
      console.log('Me endpoint response:', await meResponse.json());
    }

    // Test stats endpoint
    console.log('\n3. Testing /user/stats endpoint...');
    const statsResponse = await fetch(`${baseUrl}/user/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!statsResponse.ok) {
      console.error('Stats endpoint failed:', statsResponse.status, await statsResponse.text());
    } else {
      console.log('Stats response:', await statsResponse.json());
    }

    // Test collection endpoint
    console.log('\n4. Testing /collection endpoint...');
    const collectionResponse = await fetch(`${baseUrl}/collection`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!collectionResponse.ok) {
      console.error('Collection endpoint failed:', collectionResponse.status, await collectionResponse.text());
    } else {
      const collectionData = await collectionResponse.json() as any;
      console.log('Collection response:');
      console.log('- ID:', collectionData.id);
      console.log('- User ID:', collectionData.userId);
      console.log('- Total items:', collectionData.items?.length || 0);
      if (collectionData.items?.length > 0) {
        console.log('- First item:', collectionData.items[0].release.title);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testAuthFlow();