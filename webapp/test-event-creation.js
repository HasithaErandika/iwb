// Test script to verify event creation API
// Run this in browser console or as a separate test

async function testEventCreation() {
  const testData = new FormData();
  
  // Required fields
  testData.append('eventName', 'Test Event');
  testData.append('eventDescription', 'This is a test event description');
  testData.append('eventStartDate', '2024-02-15');
  testData.append('eventStartTime', '10:00');
  testData.append('eventEndDate', '2024-02-15');
  testData.append('eventEndTime', '12:00');
  testData.append('venueName', 'Test Venue');
  testData.append('venueGoogleMapsUrl', 'https://maps.google.com/test');
  testData.append('isPaidEvent', 'false');
  testData.append('hasLimitedCapacity', 'false');
  testData.append('requireApproval', 'false');

  try {
    console.log('Testing event creation...');
    
    const response = await fetch('http://localhost:8080/event/create', {
      method: 'POST',
      body: testData,
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    
    if (result.success) {
      console.log('✅ Event created successfully');
      console.log('Event ID:', result.data?.eventId);
    } else {
      console.log('❌ Backend returned error:', result.message);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    
    // Check if it's a CORS issue
    if (error.message.includes('CORS')) {
      console.log('💡 Possible CORS issue - ensure your Ballerina service allows frontend origin');
    }
    
    // Check if it's a connection issue
    if (error.message.includes('Failed to fetch')) {
      console.log('💡 Connection issue - ensure your Ballerina service is running on port 8080');
    }
  }
}

// Run the test
testEventCreation(); 