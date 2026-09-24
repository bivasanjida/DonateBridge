/**
 * pickupRequestController - manages NGO pickup requests and admin review.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This controller handles creating requests, listing NGO requests,
 * cancelling pending requests, and viewing all requests for administration.
 */
import DonationPost from "../models/donationPost.js";
import PickupRequest from "../models/pickupRequest.js";

/**
 * Create a pickup request for a listed item.
 * Allowed role: NGO
 * Returns: created request record with status 201.
 */
export const createPickupRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const item = await DonationPost.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Donation item not found" });
    }

    if (item.status !== "Listed") {
      return res.status(409).json({
        error: "This item is no longer available for pickup requests.",
      });
    }

    const existingRequest = await PickupRequest.findOne({
      item: itemId,
      ngo: req.user.id,
    });

    if (existingRequest) {
      return res.status(409).json({ error: "You have already requested this item." });
    }

    const pickupRequest = await PickupRequest.create({
      item: itemId,
      ngo: req.user.id,
      status: "Pending",
      message: message || "",
    });

    await DonationPost.findByIdAndUpdate(itemId, { status: "Requested" });

    const createdRequest = await PickupRequest.findById(pickupRequest._id).populate(
      "item",
      "title category status pickupLocation imageUrl",
    );

    return res.status(201).json({ request: createdRequest });
  } catch (error) {
    console.error("Error creating pickup request:", error);
    return res.status(500).json({ error: "Failed to create pickup request" });
  }
};

/**
 * Get all pickup requests created by the logged-in NGO.
 * Allowed role: NGO
 * Returns: array of requests sorted by newest first.
 */
export const getMyPickupRequests = async (req, res) => {
  try {
    const requests = await PickupRequest.find({ ngo: req.user.id })
      .populate("item", "title category status pickupLocation imageUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching NGO pickup requests:", error);
    return res.status(500).json({ error: "Failed to fetch pickup requests" });
  }
};

/**
 * Cancel a pending pickup request created by the current NGO.
 * Allowed role: NGO
 * Returns: confirmation message after deleting the request.
 */
export const cancelPickupRequest = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Pickup request not found" });
    }

    if (request.ngo.toString() !== req.user.id) {
      return res.status(403).json({ error: "You cannot cancel someone else's request" });
    }

    if (request.status !== "Pending") {
      return res.status(409).json({
        error: "Only pending pickup requests can be cancelled.",
      });
    }

    await request.deleteOne();
    await DonationPost.findByIdAndUpdate(request.item, { status: "Listed" });

    return res.status(200).json({ message: "Pickup request cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling pickup request:", error);
    return res.status(500).json({ error: "Failed to cancel pickup request" });
  }
};

/**
 * Get every pickup request for the admin team.
 * Allowed role: Admin
 * Returns: all requests with item and NGO details.
 */
export const getAllPickupRequests = async (_req, res) => {
  try {
    const requests = await PickupRequest.find()
      .populate("item", "title category status pickupLocation imageUrl")
      .populate("ngo", "name email phone organizationName role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching all pickup requests:", error);
    return res.status(500).json({ error: "Failed to fetch pickup requests" });
  }
};
