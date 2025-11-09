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
      // Increase max listeners to prevent warning
      mongoose.connection.setMaxListeners(20);

      mongoose.connection.on('error', (err) => {
        console.log('❌ MongoDB error:', err.message);
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        isConnected = false;
      });

      mongoose.connection.on('connected', () => {
        isConnected = true;
      });
    }

    // Connect if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      isConnected = true;
    }

  } catch (error: any) {
    console.log('❌ MongoDB failed:', error.message);
    isConnected = false;
  }
}