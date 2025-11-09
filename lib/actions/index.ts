"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { universalProductSearch, scrapeProductByPlatform } from "../scraper/universal";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { getSession } from "../auth";

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

    // Get the current logged-in user
    const session = await getSession();
    const userId = session ? (session.userId as string) : null;

    // Use universal scraper - supports Amazon, Flipkart, Snapdeal, Myntra
    const scrapedProduct = await scrapeProductByPlatform(productUrl);

    if(!scrapedProduct) {
      return { success: false, message: 'Failed to scrape product. Check URL and try again.' };
    }

    // Check if THIS USER already tracks this product
    const existingProduct = await Product.findOne({
      url: scrapedProduct.url,
      userId: userId
    });

    if(existingProduct) {
      // User already tracks this product - update price history
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice, date: new Date() }
      ]

      const updatedProduct = await Product.findOneAndUpdate(
        { url: scrapedProduct.url, userId: userId },
        {
          currentPrice: scrapedProduct.currentPrice,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        },
        { new: true }
      );

      revalidatePath(`/products/${updatedProduct._id}`);
      console.log('✅ Product updated for user');
      return { success: true, message: '✅ Product updated! Price history refreshed.' };
    } else {
      // New product for this user - create new entry
      const newProduct = new Product({
        ...scrapedProduct,
        userId: userId, // Associate with logged-in user (null for guests)
        priceHistory: [{ price: scrapedProduct.currentPrice, date: new Date() }],
        lowestPrice: scrapedProduct.currentPrice,
        highestPrice: scrapedProduct.currentPrice,
        averagePrice: scrapedProduct.currentPrice,
      });

      await newProduct.save();

      revalidatePath(`/products/${newProduct._id}`);
      console.log('✅ Product tracked successfully for user');
      return { success: true, message: '✅ Product tracked! You will receive email alerts.' };
    }
  } catch (error: any) {
    console.error(`⚠️ Database error while tracking: ${error.message}`);
    return {
      success: false,
      message: '❌ Failed to track product. Please try again.'
    };
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB();

    const session = await getSession();
    const userId = session ? (session.userId as string) : null;

    const query: any = { _id: productId };
    if (userId) {
      // If logged in, only get products that belong to this user
      query.userId = userId;
    } else {
      // If not logged in, only get guest products
      query.userId = null;
    }

    const product = await Product.findOne(query).lean();

    if(!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllProducts() {
  try {
    await connectToDB();

    const session = await getSession();
    const userId = session ? (session.userId as string) : null;

    let products;
    if (userId) {
      // If logged in, only get products that belong to this user
      products = await Product.find({ userId: userId }).lean();
    } else {
      // If not logged in, only get guest products
      products = await Product.find({ userId: null }).lean();
    }

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.log('⚠️ Database error, returning empty list');
    return [];
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    await connectToDB();

    const session = await getSession();
    const userId = session ? (session.userId as string) : null;

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const query: any = {
      _id: { $ne: productId },
    };

    // Only show similar products from the same user
    if (userId) {
      query.userId = userId;
    } else {
      query.userId = null;
    }

    const similarProducts = await Product.find(query).limit(3).lean();

    return JSON.parse(JSON.stringify(similarProducts));
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