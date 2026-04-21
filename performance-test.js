const axios = require('axios');

// Performance test for the events API
async function testPerformance() {
  console.log('🚀 Testing API Performance...\n');
  
  const baseUrl = 'http://localhost:7000/api/v1/events';
  
  // Test 1: First request (cold start)
  console.log('📊 Test 1: Cold Start Request');
  const start1 = Date.now();
  try {
    const response1 = await axios.get(`${baseUrl}/future?limit=10`);
    const end1 = Date.now();
    console.log(`✅ Cold start: ${end1 - start1}ms`);
    console.log(`📦 Response size: ${JSON.stringify(response1.data).length} characters`);
    console.log(`🎫 Events returned: ${response1.data.length}\n`);
  } catch (error) {
    console.log(`❌ Cold start failed: ${error.message}\n`);
  }
  
  // Test 2: Cached request
  console.log('📊 Test 2: Cached Request (should be faster)');
  const start2 = Date.now();
  try {
    const response2 = await axios.get(`${baseUrl}/future?limit=10`);
    const end2 = Date.now();
    console.log(`✅ Cached request: ${end2 - start2}ms`);
    console.log(`📦 Response size: ${JSON.stringify(response2.data).length} characters\n`);
  } catch (error) {
    console.log(`❌ Cached request failed: ${error.message}\n`);
  }
  
  // Test 3: Request with thumbnails
  console.log('📊 Test 3: Request with Thumbnails');
  const start3 = Date.now();
  try {
    const response3 = await axios.get(`${baseUrl}/future?limit=10&useThumbnails=true`);
    const end3 = Date.now();
    console.log(`✅ Thumbnail request: ${end3 - start3}ms`);
    console.log(`📦 Response size: ${JSON.stringify(response3.data).length} characters\n`);
  } catch (error) {
    console.log(`❌ Thumbnail request failed: ${error.message}\n`);
  }
  
  // Test 4: Multiple concurrent requests
  console.log('📊 Test 4: Concurrent Requests (simulating multiple users)');
  const start4 = Date.now();
  try {
    const promises = Array.from({ length: 5 }, () => 
      axios.get(`${baseUrl}/future?limit=5`)
    );
    const responses = await Promise.all(promises);
    const end4 = Date.now();
    console.log(`✅ Concurrent requests: ${end4 - start4}ms`);
    console.log(`👥 Simulated 5 concurrent users\n`);
  } catch (error) {
    console.log(`❌ Concurrent requests failed: ${error.message}\n`);
  }
  
  console.log('🎯 Performance Test Complete!');
  console.log('\n💡 Expected Improvements:');
  console.log('• First request: ~200-500ms (depending on data size)');
  console.log('• Cached request: ~10-50ms');
  console.log('• Thumbnail request: ~50-150ms (smaller images)');
  console.log('• Concurrent requests: ~100-300ms (shared cache)');
}

// Run the test
testPerformance().catch(console.error); 