"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function directAmazonSearch(query: string) {
  try {
    console.log('🔍 Attempting direct Amazon search (no proxy)...');
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const $ = cheerio.load(response.data);
    const products: any[] = [];

    // Amazon search result selectors
    const searchSelectors = [
      'div[data-component-type="s-search-result"]',
      'div.s-result-item[data-asin]',
      '.s-result-item',
    ];

    for (const selector of searchSelectors) {
      const elements = $(selector);
      console.log(`📦 Direct Amazon selector "${selector}" found ${elements.length} elements`);

      if (elements.length > 0) {
        elements.slice(0, 10).each((i, element) => {
          try {
            const title =
              $(element).find('h2 a span').text().trim() ||
              $(element).find('h2.a-size-mini span').text().trim() ||
              $(element).find('.a-size-base-plus').text().trim();

            const priceWhole =
              $(element).find('.a-price-whole').first().text().trim() ||
              $(element).find('.a-price .a-offscreen').first().text().trim();

            const price = priceWhole ? priceWhole.replace(/[₹,]/g, '').replace(/\./g, '') : null;

            const linkElement = $(element).find('h2 a, .a-link-normal').first();
            const href = linkElement.attr('href');
            const link = href ? (href.startsWith('http') ? href : `https://www.amazon.in${href}`) : '';

            const image =
              $(element).find('img.s-image').attr('src') ||
              $(element).find('img').first().attr('src') || '';

            if (title && price && link && !products.find(p => p.url === link)) {
              products.push({
                title: title.substring(0, 100),
                price: parseFloat(price) || 0,
                url: link,
                image: image,
                platform: 'Amazon (Direct)',
                currency: '₹'
              });
              console.log(`✅ Direct Amazon product: ${title.substring(0, 50)}... - ₹${price}`);
            }
          } catch (err) {
            // Skip problematic elements
          }
        });

        if (products.length > 0) break;
      }
    }

    console.log(`✅ Found ${products.length} products via direct Amazon search`);
    return products;

  } catch (error: any) {
    console.log('❌ Direct Amazon search failed:', error.message);
    return [];
  }
}

export async function directFlipkartSearch(query: string) {
  try {
    console.log('🔍 Attempting direct Flipkart search (no proxy)...');
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      maxRedirects: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.flipkart.com/'
      }
    });

    const $ = cheerio.load(response.data);
    const products: any[] = [];

    const selectors = [
      'div._1AtVbE',
      'div._2kHMtA', 
      'div._13oc-S',
      'div[data-id]',
      '.col-12-12',
      '._1fQZEK',
      '._4ddWXP'
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`📦 Direct Flipkart selector "${selector}" found ${elements.length} elements`);

      if (elements.length > 0) {
        elements.slice(0, 10).each((i, element) => {
          try {
            const title =
              $(element).find('div._4rR01T').text().trim() ||
              $(element).find('a.s1Q9rs').text().trim() ||
              $(element).find('._2WkVRV').text().trim();

            const price =
              $(element).find('div._30jeq3').text().trim() ||
              $(element).find('._1_WHN1').text().trim();

            const linkEl = $(element).find('a[href*="/p/"]').first();
            const href = linkEl.attr('href');
            const link = href ? (href.startsWith('http') ? href : `https://www.flipkart.com${href}`) : '';

            const image =
              $(element).find('img._396cs4').attr('src') ||
              $(element).find('img').first().attr('src');

            if (title && price && link && !products.find(p => p.url === link)) {
              const cleanPrice = price.replace(/[₹,]/g, '').trim();
              products.push({
                title: title.substring(0, 100),
                price: parseFloat(cleanPrice) || 0,
                url: link,
                image: image || '',
                platform: 'Flipkart (Direct)',
                currency: '₹'
              });
              console.log(`✅ Direct Flipkart product: ${title.substring(0, 50)}... - ₹${cleanPrice}`);
            }
          } catch (err) {
            // Skip problematic elements
          }
        });

        if (products.length > 0) break;
      }
    }

    console.log(`✅ Found ${products.length} products via direct Flipkart search`);
    return products;

  } catch (error: any) {
    console.log('❌ Direct Flipkart search failed:', error.message);
    return [];
  }
}