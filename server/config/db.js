import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Successfully connected to DB`);
  } catch (error) {
    console.error(`Error in connecting to DB : ${error.message}`);
  }
};
