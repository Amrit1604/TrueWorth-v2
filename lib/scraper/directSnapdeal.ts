"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function directSnapdealSearch(query: string) {
  try {
    console.log('🔍 Attempting direct Snapdeal search (no proxy)...');
    const searchUrl = `https://www.snapdeal.com/search?keyword=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.snapdeal.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const $ = cheerio.load(response.data);
    const products: any[] = [];

    // Multiple Snapdeal selectors to try
    const selectors = [
      '.product-tuple-listing',
      '.col-xs-6',
      '[data-js-pos]',
      '.product-item',
      '.product'
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`📦 Direct Snapdeal selector "${selector}" found ${elements.length} elements`);

      if (elements.length > 0) {
        elements.slice(0, 10).each((i, element) => {
          try {
            const title =
              $(element).find('.product-title').text().trim() ||
              $(element).find('p[title]').attr('title') ||
              $(element).find('.prodName').text().trim() ||
              $(element).find('.product-name').text().trim();

            const price =
              $(element).find('.product-price').text().trim() ||
              $(element).find('.lfloat.product-price').text().trim() ||
              $(element).find('.selling-price').text().trim() ||
              $(element).find('.price').text().trim();

            const linkEl = $(element).find('a.dp-widget-link, a[href*="/product/"], a').first();
            const href = linkEl.attr('href');
            const link = href ? (href.startsWith('http') ? href : `https://www.snapdeal.com${href}`) : '';

            const image =
              $(element).find('img.product-image').attr('src') ||
              $(element).find('img').first().attr('src');

            if (title && price && link && !products.find(p => p.url === link)) {
              const cleanPrice = price.replace(/[₹,Rs\.]/g, '').trim();
              const numericPrice = parseFloat(cleanPrice) || 0;
              
              if (numericPrice > 0) {
                products.push({
                  title: title.substring(0, 100),
                  price: numericPrice,
                  url: link,
                  image: image || '',
                  platform: 'Snapdeal (Direct)',
                  currency: '₹'
                });
                console.log(`✅ Direct Snapdeal product: ${title.substring(0, 50)}... - ₹${cleanPrice}`);
              }
            }
          } catch (err) {
            // Skip problematic elements
          }
        });

        if (products.length > 0) break;
      }
    }

    console.log(`✅ Found ${products.length} products via direct Snapdeal search`);
    return products;

  } catch (error: any) {
    console.log('❌ Direct Snapdeal search failed:', error.message);
    return [];
  }
}