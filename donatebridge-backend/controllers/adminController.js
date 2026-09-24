/**
 * adminController - Handles admin-only dashboard, review, and history actions.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This controller powers the admin overview, request verification workflow,
 * donation history, and user listing for the management dashboard.
 */
import DonationPost from "../models/donationPost.js";
import PickupRequest from "../models/pickupRequest.js";
import User from "../models/user.js";

/**
 * Get dashboard statistics for the admin overview page.
 *
 * @route GET /api/admin/stats
 * @access Admin only
 * @returns {Object} counts - Item counts by status, request counts, user count
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalItems,
      listedItems,
      pendingRequests,
      scheduledPickups,
      completedDonations,
      totalUsers,
      recentRequests,
    ] = await Promise.all([
      DonationPost.countDocuments(),
      DonationPost.countDocuments({ status: "Listed" }),
      PickupRequest.countDocuments({ status: "Pending" }),
      PickupRequest.countDocuments({ status: "Scheduled" }),
      PickupRequest.countDocuments({ status: "Collected" }),
      User.countDocuments(),
      PickupRequest.find({ status: "Pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({ path: "item", select: "title" })
        .populate({ path: "ngo", select: "name organizationName" })
        .lean(),
    ]);

    return res.status(200).json({
      stats: {
        totalItems,
        listedItems,
        pendingRequests,
        scheduledPickups,
        completedDonations,
        totalUsers,
      },
      recentRequests: recentRequests.map((request) => ({
        _id: request._id,
        itemTitle: request.item?.title || "Item removed",
        ngoName: request.ngo?.name || "Unknown NGO",
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ error: "Failed to load dashboard statistics." });
  }
};

/**
 * Approve a pending pickup request and move it into the review workflow.
 *
 * @route PATCH /api/admin/pickup-requests/:id/approve
 * @access Admin only
 * @returns {Object} pickupRequest - Updated request information
 */
export const approvePickupRequest = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Pickup request not found." });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Only pending requests can be approved." });
    }

    request.status = "Approved";
    if (req.body.adminNotes) {
      request.adminNotes = req.body.adminNotes;
    }

    await request.save();

    return res.status(200).json({
      message: "Pickup request approved.",
      pickupRequest: request,
    });
  } catch (error) {
    console.error("Error approving pickup request:", error);
    return res.status(500).json({ error: "Failed to approve pickup request." });
  }
};

/**
 * Reject a pickup request and reopen the donation item for other NGOs.
 *
 * @route PATCH /api/admin/pickup-requests/:id/reject
 * @access Admin only
 * @returns {Object} pickupRequest - Updated request information
 */
export const rejectPickupRequest = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Pickup request not found." });
    }

    request.status = "Rejected";
    const reason = req.body.adminNotes || req.body.reason || "Rejected by admin";
    request.adminNotes = reason;

    await request.save();

    await DonationPost.findByIdAndUpdate(request.item, { status: "Listed" });

    return res.status(200).json({
      message: "Pickup request rejected.",
      pickupRequest: request,
    });
  } catch (error) {
    console.error("Error rejecting pickup request:", error);
    return res.status(500).json({ error: "Failed to reject pickup request." });
  }
};

/**
 * Schedule a pickup time and address for an approved request.
 *
 * @route PATCH /api/admin/pickup-requests/:id/schedule
 * @access Admin only
 * @returns {Object} pickupRequest - Updated request information
 */
export const schedulePickup = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime, collectionAddress, adminNotes } = req.body;

    if (!scheduledDate || !scheduledTime || !collectionAddress) {
      return res.status(400).json({
        error: "Scheduled date, time, and collection address are required.",
      });
    }

    const request = await PickupRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Pickup request not found." });
    }

    request.status = "Scheduled";
    request.scheduledDate = new Date(scheduledDate);
    request.scheduledTime = scheduledTime;
    request.collectionAddress = collectionAddress;
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    await DonationPost.findByIdAndUpdate(request.item, { status: "Scheduled" });

    return res.status(200).json({
      message: "Pickup scheduled successfully.",
      pickupRequest: request,
    });
  } catch (error) {
    console.error("Error scheduling pickup:", error);
    return res.status(500).json({ error: "Failed to schedule pickup." });
  }
};

/**
 * Confirm collection after the pickup has been completed.
 *
 * @route PATCH /api/admin/pickup-requests/:id/collect
 * @access Admin only
 * @returns {Object} pickupRequest - Updated request information
 */
export const confirmCollection = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Pickup request not found." });
    }

    request.status = "Collected";
    await request.save();

    await DonationPost.findByIdAndUpdate(request.item, { status: "Collected" });

    return res.status(200).json({
      message: "Donation marked as collected.",
      pickupRequest: request,
    });
  } catch (error) {
    console.error("Error confirming pickup collection:", error);
    return res.status(500).json({ error: "Failed to confirm collection." });
  }
};

/**
 * Get all completed donation records for the history page.
 *
 * @route GET /api/admin/history
 * @access Admin only
 * @returns {Array} donations - Collected donation records with related data
 */
export const getDonationHistory = async (req, res) => {
  try {
    const requests = await PickupRequest.find({ status: "Collected" })
      .populate({
        path: "item",
        select: "title category pickupLocation imageUrl donor",
        populate: {
          path: "donor",
          select: "name email",
        },
      })
      .populate({
        path: "ngo",
        select: "name organizationName email",
      })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({ data: requests });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ error: "Failed to load donation history." });
  }
};

/**
 * Get all registered users for the admin user management view.
 *
 * @route GET /api/admin/users
 * @access Admin only
 * @returns {Array} users - Registered users excluding password hash
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ error: "Failed to load users." });
  }
};

/**
 * Get all pickup requests for the admin verification panel.
 *
 * @route GET /api/admin/requests/all
 * @access Admin only
 * @returns {Array} pickupRequests - All requests with nested item and NGO details
 */
export const getAllPickupRequests = async (req, res) => {
  try {
    const requests = await PickupRequest.find({})
      .populate({ path: "item", select: "title category pickupLocation" })
      .populate({ path: "ngo", select: "name organizationName email" })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ data: requests });
  } catch (error) {
    console.error("Error fetching all pickup requests:", error);
    return res.status(500).json({ error: "Failed to load pickup requests." });
  }
};
