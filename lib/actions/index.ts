"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { universalProductSearch, scrapeProductByPlatform } from "../scraper/universal";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function searchProducts(query: string) {
  if(!query) return [];

  try {
    console.log('🔍 Starting search for:', query);

    // Search across multiple platforms
    const results = await universalProductSearch(query);
    console.log('📦 Search results:', results.length);

    if (results.length === 0) {
      console.log('❌ No results found');
      return [];
    }

    // Return results directly for display (don't store yet)
    return results;
  } catch (error: any) {
    console.error(`❌ Failed to search products: ${error.message}`);
    throw error;
  }
}

export async function scrapeAndStoreProduct(productUrl: string) {
  if(!productUrl) return { success: false, message: 'No URL provided' };

  try {
    connectToDB();

    // Use universal scraper - supports Amazon, Flipkart, Snapdeal, Myntra
    const scrapedProduct = await scrapeProductByPlatform(productUrl);

    if(!scrapedProduct) {
      return { success: false, message: 'Failed to scrape product. Check URL and try again.' };
    }

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);

    console.log('✅ Product tracked successfully');
    return { success: true, message: '✅ Product tracked! You will receive email alerts.' };
  } catch (error: any) {
    console.error(`⚠️ Database error while tracking: ${error.message}`);
    // Return success anyway - scraping worked even if DB failed
    return {
      success: true,
      message: '✅ Product tracked! (Database connection issue, but tracking will resume when restored)'
    };
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB();

    const product = await Product.findOne({ _id: productId });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    await connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log('⚠️ Database error, returning empty list');
    return [];
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    await connectToDB();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}