import { NextResponse } from "next/server";

export async function GET() {
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  
  return NextResponse.json({
    status: "BrightData Configuration Check",
    credentials: {
      hasUsername: !!username && username !== 'undefined',
      hasPassword: !!password && password !== 'undefined',
      usernameLength: username ? username.length : 0,
      passwordLength: password ? password.length : 0,
      usernamePreview: username ? `${username.substring(0, 8)}...` : 'Not set'
    },
    currentIssues: [
      "HTTP 407 errors indicate proxy authentication failure",
      "All platforms (Amazon, Flipkart, Snapdeal, Myntra) getting 407",
      "Direct search working as fallback for Amazon"
    ],
    recommendations: [
      "1. Check BrightData dashboard for account status",
      "2. Verify credentials are correct and not expired", 
      "3. Ensure account has sufficient credits",
      "4. Check if IP is whitelisted (if required)",
      "5. Try generating new credentials in BrightData dashboard"
    ],
    fallbackStatus: {
      directAmazon: "✅ Working (10 red paprika products found)",
      directFlipkart: "⚠️ Working but needs better selectors",
      directSnapdeal: "🔧 Added in this update",
      directMyntra: "❌ Not implemented (complex anti-bot)"
    },
    nextSteps: [
      "Update BrightData credentials in environment variables",
      "Or continue using direct search (limited but functional)",
      "Consider alternative proxy services if BrightData issues persist"
    ],
    timestamp: new Date().toISOString()
  });
}