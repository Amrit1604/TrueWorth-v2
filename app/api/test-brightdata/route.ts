import { NextResponse } from "next/server";
import axios from 'axios';

export async function GET() {
  try {
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    
    console.log('🧪 Testing BrightData proxy credentials...');
    
    // Check if credentials exist
    if (!username || !password || username === 'undefined' || password === 'undefined') {
      return NextResponse.json({
        success: false,
        error: 'BrightData credentials not configured',
        details: {
          hasUsername: !!username && username !== 'undefined',
          hasPassword: !!password && password !== 'undefined',
          usernameLength: username?.length || 0,
          passwordLength: password?.length || 0
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Test 1: Basic proxy connection
    const session_id = Math.random().toString(36).substring(7);
    const testUrl = 'https://httpbin.org/ip';
    
    console.log('Testing with credentials format:', {
      username: `${username.substring(0, 5)}...`,
      hasPassword: !!password,
      sessionId: session_id,
      fullUsername: `${username}-session-${session_id}`
    });

    try {
      const response = await axios.get(testUrl, {
        proxy: {
          host: 'brd.superproxy.io',
          port: 22225,
          auth: {
            username: `${username}-session-${session_id}`,
            password: password
          }
        },
        timeout: 15000,
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        }),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'BrightData proxy working correctly!',
        proxyIP: response.data.origin,
        status: response.status,
        timestamp: new Date().toISOString()
      });

    } catch (proxyError: any) {
      console.error('❌ Proxy test failed:', proxyError.message);
      
      let errorAnalysis = {
        code: proxyError.response?.status,
        message: proxyError.message,
        analysis: 'Unknown error'
      };

      // Analyze the specific error
      if (proxyError.response?.status === 407) {
        errorAnalysis.analysis = 'Proxy Authentication Required - Your BrightData credentials are incorrect or expired';
      } else if (proxyError.response?.status === 429) {
        errorAnalysis.analysis = 'Rate Limited - Too many requests to BrightData';
      } else if (proxyError.code === 'ECONNREFUSED') {
        errorAnalysis.analysis = 'Connection Refused - BrightData server unreachable';
      } else if (proxyError.code === 'ETIMEDOUT') {
        errorAnalysis.analysis = 'Timeout - BrightData server not responding';
      }
      
      return NextResponse.json({
        success: false,
        error: 'BrightData proxy test failed',
        errorDetails: errorAnalysis,
        suggestions: [
          '1. Check BrightData dashboard for account status',
          '2. Verify zone credentials in BrightData portal',
          '3. Ensure subscription is active',
          '4. Try regenerating credentials',
          '5. Check if IP is whitelisted (if required)'
        ],
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔥 BrightData test API error:', error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}