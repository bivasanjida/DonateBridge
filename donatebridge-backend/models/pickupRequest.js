/**
 * PickupRequest - Tracks donor-item pickup requests initiated by NGOs.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * Each request links an item and NGO, tracks review status, and stores the
 * agreed schedule information needed by the admin verification flow.
 */
import mongoose from "mongoose";

const { Schema } = mongoose;

const pickupRequestSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "DonationPost",
      required: true,
    },
    ngo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Scheduled", "Collected"],
      default: "Pending",
    },
    message: {
      type: String,
      default: "",
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    scheduledTime: {
      type: String,
      default: "",
    },
    collectionAddress: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const PickupRequest = mongoose.model("PickupRequest", pickupRequestSchema);

export default PickupRequest;
