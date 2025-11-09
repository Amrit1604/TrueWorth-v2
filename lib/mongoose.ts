import mongoose from 'mongoose';

let isConnected = false;
let listenersAdded = false; // Track if event listeners are already added

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
    // Only set up event listeners ONCE
    if (!listenersAdded) {
      // Increase max listeners to handle multiple concurrent requests
      mongoose.connection.setMaxListeners(100);

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

      // Mark listeners as added to prevent duplicates
      listenersAdded = true;
    }

    // Connect if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,         // Reduced: Handle 10 simultaneous connections
        minPoolSize: 2,          // Reduced: Keep 2 connections always ready
        maxIdleTimeMS: 30000,    // Close idle connections after 30s
        waitQueueTimeoutMS: 5000, // Wait max 5s if all connections busy
      });

      isConnected = true;
    }

  } catch (error: any) {
    console.log('❌ MongoDB failed:', error.message);
    isConnected = false;
  }
}