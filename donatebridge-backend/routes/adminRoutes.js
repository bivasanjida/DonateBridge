/**
 * adminRoutes - Admin-only API endpoints for dashboard and workflow management.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * These routes are protected via the shared auth middleware and handle the full
 * approval, scheduling, collection, and history workflow.
 */
import express from "express";
import {
  approvePickupRequest,
  confirmCollection,
  getAllPickupRequests,
  getAllUsers,
  getDashboardStats,
  getDonationHistory,
  rejectPickupRequest,
  schedulePickup,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", authenticate, authorize("Admin"), getDashboardStats);
router.get("/history", authenticate, authorize("Admin"), getDonationHistory);
router.get("/users", authenticate, authorize("Admin"), getAllUsers);
router.get("/pickup-requests/all", authenticate, authorize("Admin"), getAllPickupRequests);
router.patch(
  "/pickup-requests/:id/approve",
  authenticate,
  authorize("Admin"),
  approvePickupRequest,
);
router.patch(
  "/pickup-requests/:id/reject",
  authenticate,
  authorize("Admin"),
  rejectPickupRequest,
);
router.patch(
  "/pickup-requests/:id/schedule",
  authenticate,
  authorize("Admin"),
  schedulePickup,
);
router.patch(
  "/pickup-requests/:id/collect",
  authenticate,
  authorize("Admin"),
  confirmCollection,
);

export default router;
