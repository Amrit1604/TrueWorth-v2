"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from '../utils';

export async function scrapeFlipkartProduct(url: string) {
  if(!url) return;

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

  try {
    console.log('🔵 Scraping Flipkart product...');
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Flipkart title selectors
    const title =
      $('span.VU-ZEz').text().trim() ||
      $('._6EBuvT span').text().trim() ||
      $('h1 span').first().text().trim() ||
      $('._35KyD6').text().trim();

    // Flipkart price selectors
    const currentPrice = extractPrice(
      $('.Nx9bqj.CxhGGd'),
      $('._30jeq3._16Jk6d'),
      $('._25b18c .lxXXQ8')
    );

    const originalPrice = extractPrice(
      $('._3I9_wc._27UcVY'),
      $('._3auQ3N._1POkHg'),
      $('._2Rrra5')
    );

    // Flipkart image
    const image =
      $('._53J4C- img').attr('src') ||
      $('._1Nyybr img').attr('src') ||
      $('._2r_T1I img').attr('src') ||
      '';

    const outOfStock =
      $('._16FRp0').text().toLowerCase().includes('out of stock') ||
      $('._16FRp0').text().toLowerCase().includes('coming soon');

    const description =
      $('._3WHvuP').text().trim() ||
      $('._1mXcCf').text().trim() ||
      '';

    console.log('✅ Flipkart product scraped:', title.substring(0, 50));

    return {
      url,
      platform: 'Flipkart',
      currency: '₹',
      image: image.startsWith('http') ? image : image ? `https:${image}` : '',
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: originalPrice && currentPrice ?
        Math.round(((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100) : 0,
      category: 'category',
      reviewsCount: 100,
      stars: 4.2,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }
  } catch (error: any) {
    console.log('❌ Flipkart scraping error:', error.message);
    throw error;
  }
}

export async function searchFlipkart(query: string) {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
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

    console.log('🔵 Searching Flipkart...');
    const response = await axios.get(searchUrl, options);
    const $ = cheerio.load(response.data);

    const products: any[] = [];

    // Flipkart search result selectors
    const selectors = [
      'div._1AtVbE',
      'div._2kHMtA',
      'div._13oc-S',
      'div[data-id]'
    ];

    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`📦 Flipkart selector "${selector}" found ${elements.length} elements`);

      if (elements.length > 0) {
        elements.slice(0, 10).each((i, element) => {
          try {
            const title =
              $(element).find('div._4rR01T').text().trim() ||
              $(element).find('a.s1Q9rs').text().trim() ||
              $(element).find('._2WkVRV').text().trim() ||
              $(element).find('.IRpwTa').text().trim();

            const price =
              $(element).find('div._30jeq3').text().trim() ||
              $(element).find('._25b18c').text().trim() ||
              $(element).find('._1_WHN1').text().trim();

            const linkEl = $(element).find('a._1fQZEK, a.s1Q9rs, a._2rpwqI').first();
            const href = linkEl.attr('href');
            const link = href ? (href.startsWith('http') ? href : `https://www.flipkart.com${href}`) : '';

            const image =
              $(element).find('img._396cs4').attr('src') ||
              $(element).find('img._2r_T1I').attr('src') ||
              $(element).find('img').first().attr('src');

            const rating =
              $(element).find('div._3LWZlK').text().trim() ||
              $(element).find('._3LWZlK').text().trim() ||
              '4.0';

            if (title && price && link && !products.find(p => p.url === link)) {
              const cleanPrice = price.replace(/[₹,]/g, '').trim();
              products.push({
                title: title.substring(0, 100),
                price: parseFloat(cleanPrice) || 0,
                url: link,
                image: image || '',
                platform: 'Flipkart',
                rating: rating.split(' ')[0] || '4.0',
                currency: '₹'
              });
              console.log(`✅ Flipkart product: ${title.substring(0, 50)}... - ₹${cleanPrice}`);
            }
          } catch (err) {
            console.log('⚠️ Error parsing Flipkart product:', err);
          }
        });

        if (products.length > 0) break;
      }
    }

    console.log(`✅ Found ${products.length} Flipkart products`);
    return products;
  } catch (error: any) {
    console.log('❌ Flipkart search error:', error.message);
    throw error;
  }
}
