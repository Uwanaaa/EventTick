import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {

  let MONGO_URI = process.env.URI;


  if (MONGO_URI !== undefined) {
    try {
      let cluster = await mongoose.connect(process.env.URI);
      console.log(`MongoDB connected successfuly to remote cluster.`);

    } catch (error) {
      console.error("Database Connection Error: ", error.message);
      // process.exit(1);
    }
  }
}
