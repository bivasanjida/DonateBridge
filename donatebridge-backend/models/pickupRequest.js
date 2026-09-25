/**
 * PickupRequest - tracks NGO requests for donated items.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * The model stores the requested item, the NGO making the request,
 * and the current status plus any admin scheduling details.
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
      trim: true,
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
      trim: true,
    },
    collectionAddress: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

pickupRequestSchema.index({ item: 1, ngo: 1 }, { unique: true });

const PickupRequest = mongoose.model("PickupRequest", pickupRequestSchema);

export default PickupRequest;
