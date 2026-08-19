import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to DB:", error);
        throw error;
    }
}

export default connectDB;