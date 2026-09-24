import mongoose from "mongoose";

const { Schema } = mongoose;

const donationPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    itemCondition: {
      type: String,
      enum: ["New", "Good", "Used"],
      default: "Good",
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Collected"],
      default: "Available",
    },
  },
  { timestamps: true },
);

const DonationPost = mongoose.model("DonationPost", donationPostSchema);

export default DonationPost;
