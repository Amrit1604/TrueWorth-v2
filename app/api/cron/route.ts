import { NextResponse } from "next/server";

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeProductByPlatform } from "@/lib/scraper/universal";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper function to add delay between requests (rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    await connectToDB();

    const products = await Product.find({});

    if (!products || products.length === 0) {
      return NextResponse.json({
        message: "No products to update",
        stats: { total: 0, updated: 0, failed: 0, skipped: 0 }
      });
    }

    console.log(`🔄 Cron job started for ${products.length} products at ${new Date().toISOString()}`);

    const results = {
      updated: [] as any[],
      failed: [] as any[],
      skipped: [] as any[]
    };

    // Process products SEQUENTIALLY with delays (avoid rate limiting)
    for (const currentProduct of products) {
      try {
        console.log(`\n📦 Processing: ${currentProduct.title}`);
        console.log(`   Platform: ${currentProduct.platform || 'Unknown'}`);
        console.log(`   URL: ${currentProduct.url}`);
        
        // Add 3 second delay between each product to avoid rate limiting
        if (results.updated.length + results.failed.length > 0) {
          console.log(`⏳ Waiting 3 seconds before next product...`);
          await delay(3000);
        }

        // Scrape product with timeout
        const scrapedProduct = await Promise.race([
          scrapeProductByPlatform(currentProduct.url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Scraping timeout after 45s')), 45000)
          )
        ]) as any;

        if (!scrapedProduct || !scrapedProduct.currentPrice) {
          console.log(`❌ Scraping failed or no price found`);
          
          // FALLBACK: Use existing price with timestamp
          const updatedPriceHistory = [
            ...currentProduct.priceHistory,
            {
              price: currentProduct.currentPrice,
              date: new Date(),
            },
          ];

          await Product.findOneAndUpdate(
            { url: currentProduct.url },
            { 
              priceHistory: updatedPriceHistory,
              lowestPrice: getLowestPrice(updatedPriceHistory),
              highestPrice: getHighestPrice(updatedPriceHistory),
              averagePrice: getAveragePrice(updatedPriceHistory),
            }
          );

          results.skipped.push({
            title: currentProduct.title,
            reason: 'Scraping failed - used existing price',
            price: currentProduct.currentPrice
          });
          
          console.log(`⚠️ Skipped - Added existing price to history`);
          continue;
        }

        // REAL DATA: Update price history
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
            date: new Date(),
          },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update in database
        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product,
          { new: true }
        );

        console.log(`✅ Updated successfully!`);
        console.log(`   Current: ₹${scrapedProduct.currentPrice}`);
        console.log(`   Lowest: ₹${product.lowestPrice}`);
        console.log(`   Highest: ₹${product.highestPrice}`);
        console.log(`   History points: ${updatedPriceHistory.length}`);

        results.updated.push({
          title: updatedProduct.title,
          currentPrice: scrapedProduct.currentPrice,
          lowestPrice: product.lowestPrice,
          highestPrice: product.highestPrice,
          averagePrice: product.averagePrice,
          historyPoints: updatedPriceHistory.length,
        });

        // ======================== 2 EMAIL NOTIFICATIONS
        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct.users.length > 0) {
          try {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
            };
            const emailContent = await generateEmailBody(productInfo, emailNotifType);
            const userEmails = updatedProduct.users.map((user: any) => user.email);
            
            await sendEmail(emailContent, userEmails);
            console.log(`📧 Email sent to ${userEmails.length} users - Type: ${emailNotifType}`);
          } catch (emailError: any) {
            console.log(`⚠️ Email failed: ${emailError.message}`);
          }
        }

      } catch (error: any) {
        console.log(`❌ Error processing ${currentProduct.title}: ${error.message}`);
        
        results.failed.push({
          title: currentProduct.title,
          url: currentProduct.url,
          error: error.message
        });
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n✅ Cron job completed in ${duration}s`);
    console.log(`   Updated: ${results.updated.length}`);
    console.log(`   Skipped: ${results.skipped.length}`);
    console.log(`   Failed: ${results.failed.length}`);

    return NextResponse.json({
      message: "Cron job completed successfully",
      duration: `${duration}s`,
      timestamp: new Date().toISOString(),
      stats: {
        total: products.length,
        updated: results.updated.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
      },
      details: {
        updated: results.updated,
        skipped: results.skipped,
        failed: results.failed,
      }
    });
    
  } catch (error: any) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`❌ Cron job failed after ${duration}s: ${error.message}`);
    
    return NextResponse.json(
      { 
        error: `Cron job failed: ${error.message}`,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
