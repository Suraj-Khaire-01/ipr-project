const mongoose = require('mongoose');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    return conn;

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Log specific MongoDB connection errors
    if (error.name === 'MongoNetworkError') {
      console.error('🔗 Network error: Check your internet connection and MongoDB Atlas settings');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('🔐 Authentication error: Check your MongoDB username and password');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('🗄️ Server selection error: Check your MongoDB URI and cluster availability');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

// Function to check database health
const checkDBHealth = async () => {
  try {
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return { status: 'healthy', result };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Function to get database statistics
const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      storageSize: stats.storageSize,
      objects: stats.objects
    };
  } catch (error) {
    console.error('Error getting DB stats:', error);
    return null;
  }
};

module.exports = {
  connectDB,
  checkDBHealth,
  getDBStats
};