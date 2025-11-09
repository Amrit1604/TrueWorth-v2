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

    const allResults: any[] = [];

    // Search platforms in parallel with FAST TIMEOUT (10 seconds each)
    // This ensures slow/failing platforms don't delay fast ones
    const searchPromises = [
      searchAmazonProducts(query).catch(err => {
        console.log('⚠️ Amazon search failed:', err.message);
        return [];
      }),
      searchFlipkart(query).catch(err => {
        console.log('⚠️ Flipkart search failed:', err.message);
        return [];
      }),
      searchSnapdeal(query).catch(err => {
        console.log('⚠️ Snapdeal search failed:', err.message);
        return [];
      }),
      searchMyntra(query).catch(err => {
        console.log('⚠️ Myntra search failed:', err.message);
        return [];
      })
    ];

    // Wait maximum 15 seconds for all platforms
    // If any platform takes longer, we move on with what we have
    const results = await Promise.race([
      Promise.allSettled(searchPromises),
      new Promise<any[]>((resolve) =>
        setTimeout(() => {
          console.log('⏱️ 15s timeout - returning results we have so far');
          resolve([]);
        }, 15000)
      )
    ]);

    // Collect results from successful platforms
    if (Array.isArray(results)) {
      for (const result of results) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          allResults.push(...result.value);
          if (result.value.length > 0) {
            console.log(`✅ Got ${result.value.length} products from a platform`);
          }
        }
      }
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
      timeout: 10000, // Reduced to 10 seconds
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
