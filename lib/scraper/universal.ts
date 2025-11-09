"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeAmazonProduct } from './index';
import { scrapeFlipkartProduct, searchFlipkart } from './flipkart';
import { scrapeSnapdealProduct, searchSnapdeal } from './snapdeal';
import { scrapeMyntraProduct, searchMyntra } from './myntra';

export async function universalProductSearch(query: string) {
  try {
    console.log('🔍 Universal search starting for:', query);
    console.log('🌐 Searching across Amazon, Flipkart, Snapdeal, Myntra...');

    // Search all platforms in parallel
    const [amazonResults, flipkartResults, snapdealResults, myntraResults] = await Promise.allSettled([
      searchAmazonProducts(query),
      searchFlipkart(query),
      searchSnapdeal(query),
      searchMyntra(query)
    ]);

    const allResults: any[] = [];

    // Combine results from all platforms
    if (amazonResults.status === 'fulfilled') {
      console.log(`✅ Amazon: ${amazonResults.value.length} products`);
      allResults.push(...amazonResults.value);
    } else {
      console.log('⚠️ Amazon search failed:', amazonResults.reason?.message);
    }

    if (flipkartResults.status === 'fulfilled') {
      console.log(`✅ Flipkart: ${flipkartResults.value.length} products`);
      allResults.push(...flipkartResults.value);
    } else {
      console.log('⚠️ Flipkart search failed:', flipkartResults.reason?.message);
    }

    if (snapdealResults.status === 'fulfilled') {
      console.log(`✅ Snapdeal: ${snapdealResults.value.length} products`);
      allResults.push(...snapdealResults.value);
    } else {
      console.log('⚠️ Snapdeal search failed:', snapdealResults.reason?.message);
    }

    if (myntraResults.status === 'fulfilled') {
      console.log(`✅ Myntra: ${myntraResults.value.length} products`);
      allResults.push(...myntraResults.value);
    } else {
      console.log('⚠️ Myntra search failed:', myntraResults.reason?.message);
    }

    // Sort by price (cheapest first)
    const sortedResults = allResults.sort((a, b) => a.price - b.price);

    console.log(`🎉 Total results from all platforms: ${sortedResults.length}`);
    return sortedResults;
  } catch (error: any) {
    console.error('❌ Universal search error:', error.message);
    throw new Error(`Search failed: ${error.message}`);
  }
}

async function searchAmazonProducts(query: string) {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
      auth: {
        username: `${username}-session-${session_id}`,
        password,
      },
      host: 'brd.superproxy.io',
      port,
      rejectUnauthorized: false,
      timeout: 30000,
    }

    console.log('🌐 Fetching from Amazon search...');
    const response = await axios.get(searchUrl, options);
    const $ = cheerio.load(response.data);

    const products: any[] = [];

    // Try multiple Amazon selectors (they change frequently)
    const searchSelectors = [
      'div[data-component-type="s-search-result"]',
      'div.s-result-item[data-asin]',
      '.s-result-item',
    ];

    let foundElements = false;

    for (const selector of searchSelectors) {
      const elements = $(selector);
      console.log(`📦 Selector "${selector}" found ${elements.length} elements`);

      if (elements.length > 0) {
        foundElements = true;
        elements.slice(0, 10).each((i, element) => {
          try {
            // Try multiple title selectors
            const title =
              $(element).find('h2 a span').text().trim() ||
              $(element).find('h2.a-size-mini span').text().trim() ||
              $(element).find('.a-size-base-plus').text().trim() ||
              $(element).find('.a-size-medium').text().trim();

            // Try multiple price selectors
            const priceWhole =
              $(element).find('.a-price-whole').first().text().trim() ||
              $(element).find('.a-price .a-offscreen').first().text().trim() ||
              $(element).find('span.a-price span').first().text().trim();

            const price = priceWhole ? priceWhole.replace(/[₹,]/g, '').replace(/\./g, '') : null;

            // Get product link
            const linkElement = $(element).find('h2 a, .a-link-normal').first();
            const href = linkElement.attr('href');
            const link = href ? (href.startsWith('http') ? href : `https://www.amazon.in${href}`) : '';

            // Get image
            const image =
              $(element).find('img.s-image').attr('src') ||
              $(element).find('img').first().attr('src') ||
              '';

            // Get rating
            const rating =
              $(element).find('span.a-icon-alt').first().text().trim() ||
              $(element).find('.a-star-small span').first().text().trim() ||
              '4.0';

            if (title && price && link && !products.find(p => p.url === link)) {
              products.push({
                title: title.substring(0, 100),
                price: parseFloat(price) || 0,
                url: link,
                image: image || '',
                platform: 'Amazon',
                rating: rating.split(' ')[0] || '4.0',
                currency: '₹'
              });
              console.log(`✅ Found product: ${title.substring(0, 50)}... - ₹${price}`);
            }
          } catch (err) {
            console.log('⚠️ Error parsing product:', err);
          }
        });

        if (products.length > 0) break;
      }
    }

    if (!foundElements) {
      console.log('❌ No product elements found with any selector');
      console.log('📄 Page title:', $('title').text());
    }

    console.log(`✅ Found ${products.length} Amazon products`);
    return products;
  } catch (error: any) {
    console.error('❌ Amazon search error:', error.message);
    throw error;
  }
}

export async function scrapeProductByPlatform(url: string) {
  console.log('🔍 Detecting platform for URL:', url);

  try {
    if (url.includes('flipkart.com')) {
      console.log('🔵 Detected: Flipkart');
      return await scrapeFlipkartProduct(url);
    } else if (url.includes('amazon')) {
      console.log('🟠 Detected: Amazon');
      return await scrapeAmazonProduct(url);
    } else if (url.includes('snapdeal.com')) {
      console.log('🟠 Detected: Snapdeal');
      return await scrapeSnapdealProduct(url);
    } else if (url.includes('myntra.com')) {
      console.log('🟣 Detected: Myntra');
      return await scrapeMyntraProduct(url);
    } else {
      console.log('❌ Unknown platform');
      return null;
    }
  } catch (error: any) {
    console.log(`❌ Platform scraping failed: ${error.message}`);
    return null;
  }
}
