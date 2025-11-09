import { NextResponse } from "next/server";
import { testScraping } from "@/lib/scraper/test";
import { universalProductSearch } from "@/lib/scraper/universal";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'iPhone';

    console.log('🧪 Testing scraping for query:', query);

    // First test the basic scraping setup
    const testResult = await testScraping();
    console.log('Test result:', testResult);

    // Then try actual product search
    let searchResult = [];
    try {
      searchResult = await universalProductSearch(query);
    } catch (searchError: any) {
      console.log('Search error:', searchError.message);
    }

    return NextResponse.json({
      testResult,
      searchResult: {
        query,
        count: searchResult.length,
        products: searchResult.slice(0, 3) // Just first 3 for testing
      },
      environment: {
        hasUsername: !!process.env.BRIGHT_DATA_USERNAME,
        hasPassword: !!process.env.BRIGHT_DATA_PASSWORD,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔥 Test scraping API error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}