"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice } from '../utils';

export async function scrapeSnapdealProduct(url: string) {
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
    console.log('🟠 Scraping Snapdeal product...');
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title =
      $('h1.pdp-e-i-head').text().trim() ||
      $('.title-section h1').text().trim() ||
      $('h1').first().text().trim();

    const currentPrice = extractPrice(
      $('.payBlkBig'),
      $('.pdp-final-price span'),
      $('.selling-price span')
    );

    const originalPrice = extractPrice(
      $('.pdp-strikthrough-price'),
      $('.lfloat.marR10 span')
    );

    const image =
      $('.cloudzoom').attr('src') ||
      $('.productImage img').attr('src') ||
      $('img[itemprop="image"]').attr('src') ||
      '';

    const outOfStock =
      $('.sold-out-err').length > 0 ||
      $('.notify-me').length > 0;

    const description =
      $('.product-desc-content').text().trim() ||
      $('.detailssubbox').text().trim() ||
      '';

    console.log('✅ Snapdeal product scraped:', title.substring(0, 50));

    return {
      url,
      platform: 'Snapdeal',
      currency: '₹',
      image: image.startsWith('http') ? image : image ? `https:${image}` : '',
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: originalPrice && currentPrice ?
        Math.round(((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100) : 0,
      category: 'category',
      reviewsCount: 50,
      stars: 4.0,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }
  } catch (error: any) {
    console.log('❌ Snapdeal scraping error:', error.message);
    throw error;
  }
}

export async function searchSnapdeal(query: string) {
  try {
    const searchUrl = `https://www.snapdeal.com/search?keyword=${encodeURIComponent(query)}`;
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

    console.log('🟠 Searching Snapdeal...');
    const response = await axios.get(searchUrl, options);
    const $ = cheerio.load(response.data);

    const products: any[] = [];

    $('.product-tuple-listing, .col-xs-6').slice(0, 10).each((i, element) => {
      try {
        const title =
          $(element).find('.product-title').text().trim() ||
          $(element).find('p[title]').attr('title') ||
          $(element).find('.prodName').text().trim();

        const price =
          $(element).find('.product-price').text().trim() ||
          $(element).find('.lfloat.product-price').text().trim() ||
          $(element).find('.selling-price').text().trim();

        const linkEl = $(element).find('a.dp-widget-link, a[href*="/product/"]').first();
        const href = linkEl.attr('href');
        const link = href ? (href.startsWith('http') ? href : `https://www.snapdeal.com${href}`) : '';

        const image =
          $(element).find('img.product-image').attr('src') ||
          $(element).find('img').first().attr('src');

        if (title && price && link && !products.find(p => p.url === link)) {
          const cleanPrice = price.replace(/[₹,Rs\.]/g, '').trim();
          products.push({
            title: title.substring(0, 100),
            price: parseFloat(cleanPrice) || 0,
            url: link,
            image: image || '',
            platform: 'Snapdeal',
            rating: '4.0',
            currency: '₹'
          });
          console.log(`✅ Snapdeal product: ${title.substring(0, 50)}... - ₹${cleanPrice}`);
        }
      } catch (err) {
        console.log('⚠️ Error parsing Snapdeal product:', err);
      }
    });

    console.log(`✅ Found ${products.length} Snapdeal products`);
    return products;
  } catch (error: any) {
    console.log('❌ Snapdeal search error:', error.message);
    throw error;
  }
}
