/**
 * DonationPost - Represents a donated item posted for pickup requests.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This model stores each item's core details, current status, and the donor
 * relationship required for admin workflow and donation history tracking.
 */
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
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
      default: "",
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
      enum: ["Listed", "Requested", "Approved", "Scheduled", "Collected"],
      default: "Listed",
    },
  },
  { timestamps: true },
);

const DonationPost = mongoose.model("DonationPost", donationPostSchema);

export default DonationPost;
