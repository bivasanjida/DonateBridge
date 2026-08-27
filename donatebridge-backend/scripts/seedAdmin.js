import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/user.js";

const DEFAULT_EMAIL = "admin@donatebridge.local";
const DEFAULT_PASSWORD = "Admin123!";

const seedAdmin = async () => {
  const email = process.env.ADMIN_SEED_EMAIL || DEFAULT_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD || DEFAULT_PASSWORD;

  if (!process.env.ADMIN_SEED_EMAIL || !process.env.ADMIN_SEED_PASSWORD) {
    console.warn(
      "ADMIN_SEED_EMAIL/ADMIN_SEED_PASSWORD not set — using default demo credentials.",
    );
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`Admin already exists (${email}), skipping.`);
      process.exit(0);
    }

    await User.create({
      name: "Platform Admin",
      email,
      password,
      phone: "0000000000",
      role: "Admin",
    });

    console.log(`Admin created: ${email} / ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(`Error seeding admin: ${err}`);
    process.exit(1);
  }
};

seedAdmin();
