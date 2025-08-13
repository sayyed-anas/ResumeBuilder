import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("BD Connected successfully.");
    });
  } catch (error) {
    console.log(error.message);
  }
};
