import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yastandel7525:SonY7505@cluster0.yz7rib4.mongodb.net/food-del", 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1); // Exit the process with an error code
  }
};
