import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import config from "../src/config/config.js"
import userModel from "../src/models/user.model.js"

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await userModel.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, 10);

    await userModel.create({
      username: "Super Admin",
      email: config.EMAIL_ADMIN,
      password: hashedPassword,
      role: "admin",
      accountStatus: "ACTIVE",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();