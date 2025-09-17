// Test script for the chart analysis API

// Test data (fake base64 image)
const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAEAAQABAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAHwEAAQUBAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC/wAALCAEAAQABAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAHwEAAQUBAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//aAAwDAQACEQMRAD8A9mooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==';

async function testAnalyzeAPI() {
    try {
        console.log('🧪 Testing Chart Analysis API...');
        
        const response = await fetch('http://localhost:3001/api/analyze-chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: testImageData,
                symbol: 'EURUSD'
            })
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            return;
        }

        const result = await response.json();
        console.log('✅ Success! Analysis result:');
        console.log(JSON.stringify(result, null, 2));

        // Test specific fields
        console.log('\n🔍 Technical Analysis Check:');
        console.log('- Support:', result.support || result.technicalAnalysis?.support || 'MISSING');
        console.log('- Resistance:', result.resistance || result.technicalAnalysis?.resistance || 'MISSING');
        console.log('- Indicators:', result.indicators || result.technicalAnalysis?.indicators || 'MISSING');
        console.log('- Trend:', result.trend || result.technicalAnalysis?.trend || 'MISSING');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('📋 Full error:', error);
    }
}

testAnalyzeAPI();