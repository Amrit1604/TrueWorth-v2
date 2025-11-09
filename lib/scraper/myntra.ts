"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMyntraProduct(url: string) {
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
    timeout: 10000, // Reduced to 10 seconds for faster failure
  }

  try {
    console.log('🟣 Scraping Myntra product...');
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title =
      $('.pdp-title').text().trim() ||
      $('h1.pdp-name').text().trim() ||
      $('h1').first().text().trim();

    // Myntra uses different price structure
    const priceText = $('.pdp-price strong').text().trim() || $('.price-discount').text().trim();
    const currentPrice = priceText.replace(/[₹,Rs]/g, '').trim();

    const originalPriceText = $('.pdp-mrp').text().trim() || $('.price-original').text().trim();
    const originalPrice = originalPriceText.replace(/[₹,Rs]/g, '').trim();

    const image =
      $('.image-grid-image').first().attr('src') ||
      $('.img-responsive').first().attr('src') ||
      '';

    const outOfStock =
      $('.size-buttons-size-button-out-of-stock').length > 0 ||
      $('.notify-me').length > 0;

    const description =
      $('.pdp-product-description-content').text().trim() ||
      $('.product-description').text().trim() ||
      '';

    console.log('✅ Myntra product scraped:', title.substring(0, 50));

    return {
      url,
      platform: 'Myntra',
      currency: '₹',
      image: image.startsWith('http') ? image : image ? `https:${image}` : '',
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: originalPrice && currentPrice ?
        Math.round(((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100) : 0,
      category: 'Fashion',
      reviewsCount: 75,
      stars: 4.3,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }
  } catch (error: any) {
    console.log('❌ Myntra scraping error:', error.message);
    throw error;
  }
}

export async function searchMyntra(query: string) {
  try {
    const searchUrl = `https://www.myntra.com/${encodeURIComponent(query)}`;
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    
    if (!username || !password || username === 'undefined' || password === 'undefined') {
      console.log('⚠️ BrightData credentials not configured, skipping Myntra search');
      return [];
    }

    const session_id = Math.random().toString(36).substring(7);

    console.log('🟣 Searching Myntra...');
    const response = await axios.get(searchUrl, {
      proxy: {
        host: 'brd.superproxy.io',
        port: 22225,
        auth: {
          username: `${username}-session-${session_id}`,
          password: password
        }
      },
      timeout: 15000, // Increased timeout for Myntra
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.myntra.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const $ = cheerio.load(response.data);

    const products: any[] = [];

    $('.product-base, .search-product').slice(0, 10).each((i, element) => {
      try {
        const title =
          $(element).find('.product-product').text().trim() ||
          $(element).find('.product-brand').text().trim();

        const price =
          $(element).find('.product-discountedPrice').text().trim() ||
          $(element).find('.product-price span').first().text().trim();

        const linkEl = $(element).find('a').first();
        const href = linkEl.attr('href');
        const link = href ? (href.startsWith('http') ? href : `https://www.myntra.com${href}`) : '';

        const image =
          $(element).find('img.img-responsive').attr('src') ||
          $(element).find('img').first().attr('src');

        const rating =
          $(element).find('.product-rating').text().trim() ||
          '4.2';

        if (title && price && link && !products.find(p => p.url === link)) {
          const cleanPrice = price.replace(/[₹,Rs]/g, '').trim();
          products.push({
            title: title.substring(0, 100),
            price: parseFloat(cleanPrice) || 0,
            url: link,
            image: image || '',
            platform: 'Myntra',
            rating: rating || '4.2',
            currency: '₹'
          });
          console.log(`✅ Myntra product: ${title.substring(0, 50)}... - ₹${cleanPrice}`);
        }
      } catch (err) {
        console.log('⚠️ Error parsing Myntra product:', err);
      }
    });

    console.log(`✅ Found ${products.length} Myntra products`);
    return products;
  } catch (error: any) {
    console.log('❌ Myntra search error:', error.message);
    throw error;
  }
}
