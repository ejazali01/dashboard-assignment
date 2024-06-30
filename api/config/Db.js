import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `\nDatabase connected successfully !! Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`\nError in Database Connection!! Host :${error.message}`);
  }
};

export default connectDb