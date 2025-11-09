"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function testScraping() {
  try {
    console.log('🧪 Testing scraping configuration...');
    
    // Check environment variables
    const brightDataUser = process.env.BRIGHT_DATA_USERNAME;
    const brightDataPass = process.env.BRIGHT_DATA_PASSWORD;
    
    console.log('Environment check:', {
      hasBrightDataUser: !!brightDataUser,
      hasBrightDataPass: !!brightDataPass,
      nodeEnv: process.env.NODE_ENV
    });

    if (!brightDataUser || !brightDataPass) {
      console.log('❌ BrightData credentials missing, testing direct requests...');
      return await testDirectRequest();
    }

    console.log('✅ BrightData credentials found, testing proxy...');
    return await testProxyRequest();

  } catch (error: any) {
    console.error('🔥 Scraping test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testDirectRequest() {
  try {
    const testUrl = 'https://httpbin.org/user-agent';
    const response = await axios.get(testUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      }
    });

    console.log('✅ Direct request successful');
    return { 
      success: true, 
      method: 'direct',
      userAgent: response.data['user-agent'],
      status: response.status 
    };
  } catch (error: any) {
    console.log('❌ Direct request failed:', error.message);
    return { success: false, method: 'direct', error: error.message };
  }
}

async function testProxyRequest() {
  try {
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const session_id = Math.random().toString(36).substring(7);

    const testUrl = 'https://httpbin.org/ip';
    
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('✅ Proxy request successful');
    return { 
      success: true, 
      method: 'proxy',
      proxyIp: response.data.origin,
      status: response.status 
    };
  } catch (error: any) {
    console.log('❌ Proxy request failed:', error.message);
    return { success: false, method: 'proxy', error: error.message };
  }
}