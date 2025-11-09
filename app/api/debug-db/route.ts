import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      BRIGHT_DATA_USERNAME: !!process.env.BRIGHT_DATA_USERNAME,
      BRIGHT_DATA_PASSWORD: !!process.env.BRIGHT_DATA_PASSWORD,
      NODE_ENV: process.env.NODE_ENV
    };

    // Test database connection
    let dbStatus = {};
    try {
      console.log('🔍 Testing database connection...');
      await connectToDB();
      
      const connectionState = mongoose.connection.readyState;
      const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      console.log('📊 Connection state:', stateNames[connectionState]);
      
      if (connectionState === 1) {
        // Try to count products
        const productCount = await Product.countDocuments();
        const guestProducts = await Product.countDocuments({ userId: null });
        const userProducts = await Product.countDocuments({ userId: { $ne: null } });
        
        console.log('📦 Product counts:', { total: productCount, guest: guestProducts, user: userProducts });
        
        dbStatus = {
          connected: true,
          connectionState: stateNames[connectionState],
          productCount: productCount,
          guestProducts: guestProducts,
          userProducts: userProducts,
          collections: await mongoose.connection.db.collections().then(cols => cols.map(c => c.collectionName))
        };
      } else {
        dbStatus = {
          connected: false,
          connectionState: stateNames[connectionState],
          error: 'Not connected to database'
        };
      }
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError);
      dbStatus = {
        connected: false,
        error: dbError.message,
        name: dbError.name,
        code: dbError.code
      };
    }

    return NextResponse.json({
      environment: envVars,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔥 Debug DB API error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        name: error.name,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}