import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    if (process.env.MONGO_DB_URI) {
      await mongoose.connect(process.env.MONGO_DB_URI);
      console.log("connected to MongoDB");
    }
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
  }
}

export default connectToMongoDB;