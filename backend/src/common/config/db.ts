// src/config/database.js
const mongoose = require('mongoose');

const connectDatabase = async (uri:string) => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');
  } catch (error:any) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error:any) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};
