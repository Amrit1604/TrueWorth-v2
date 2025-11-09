import { NextResponse } from "next/server";

export async function GET() {
  try {
    const username = process.env.BRIGHT_DATA_USERNAME;
    const password = process.env.BRIGHT_DATA_PASSWORD;
    
    console.log('🔍 Checking BrightData credentials...');
    
    return NextResponse.json({
      brightData: {
        hasUsername: !!username && username !== 'undefined',
        usernameLength: username ? username.length : 0,
        usernamePreview: username ? username.substring(0, 8) + '...' : 'NOT SET',
        hasPassword: !!password && password !== 'undefined',
        passwordLength: password ? password.length : 0,
        passwordPreview: password ? '*'.repeat(Math.min(password.length, 8)) : 'NOT SET',
        
        // Common issues
        possibleIssues: [
          !username || username === 'undefined' ? 'Username not set in environment' : null,
          !password || password === 'undefined' ? 'Password not set in environment' : null,
          username && username.length < 10 ? 'Username seems too short' : null,
          password && password.length < 10 ? 'Password seems too short' : null,
        ].filter(Boolean)
      },
      
      troubleshooting: {
        commonCauses: [
          'BrightData subscription expired',
          'Wrong zone credentials (using wrong endpoint)',
          'Credentials not properly set in Vercel environment variables',
          'Username format incorrect (should be zone-user-session format)',
          'Password format incorrect'
        ],
        
        checkList: [
          '1. Login to BrightData dashboard',
          '2. Go to Zones > Your Zone > Access Parameters',
          '3. Copy the exact username (format: zone-user)',
          '4. Copy the exact password',
          '5. Set BRIGHT_DATA_USERNAME and BRIGHT_DATA_PASSWORD in Vercel',
          '6. Redeploy the application'
        ]
      },
      
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}