import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("mongodb uri not found");
  }
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(connection.connection.host);
  } catch (err) {
    console.error(`Errror connecting to db`);
  }
};

export default connectDB;
