import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;

    // Check if dbURI is defined
    if (!dbURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Ensures compatibility with newer versions of MongoDB
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure code
  }
};

export default connectDB;
