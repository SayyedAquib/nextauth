import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = await mongoose.connection

    connection.on('connected', () => {
      console.log("MongoDB connected");
    })

    connection.on('error', (error) => {
      console.log("MongoDB Connection Error, Please make sure db is up and running", error);
      process.exit()
    })
  } catch (error) {
    console.log("Something went wrong in connecting to Mongoose");
    console.error(error)
  }
}