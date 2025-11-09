import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI is not defined');
    return;
  }

  // If already connected, return immediately
  if(isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // Only set up event listeners once
    if (!isConnected) {
      // Increase max listeners to handle multiple concurrent requests
      mongoose.connection.setMaxListeners(50);

      mongoose.connection.on('error', (err) => {
        console.log('❌ MongoDB error:', err.message);
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        isConnected = false;
      });

      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected');
        isConnected = true;
      });
    }

    // Connect if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 50,        // Increased: Handle 50 simultaneous connections
        minPoolSize: 5,         // Keep 5 connections always ready
        maxIdleTimeMS: 30000,   // Close idle connections after 30s
        waitQueueTimeoutMS: 5000, // Wait max 5s if all connections busy
      });

      isConnected = true;
    }

  } catch (error: any) {
    console.log('❌ MongoDB failed:', error.message);
    isConnected = false;
  }
}