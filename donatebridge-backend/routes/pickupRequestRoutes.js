/**
 * pickupRequestRoutes - API routes for NGO pickup requests.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * These routes support NGO request creation, list views, and admin review
 * of pickup workflows for donated items.
 */
import express from "express";
import {
  createPickupRequest,
  getMyPickupRequests,
  cancelPickupRequest,
  getAllPickupRequests,
} from "../controllers/pickupRequestController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, authorize("NGO"), createPickupRequest);
router.get("/mine", authenticate, authorize("NGO"), getMyPickupRequests);
router.delete("/:id", authenticate, authorize("NGO"), cancelPickupRequest);
router.get("/all", authenticate, authorize("Admin"), getAllPickupRequests);
router.patch("/:id", authenticate, authorize("Admin"), (_req, res) => {
  return res.status(501).json({ error: "Pickup request update is not implemented yet." });
});

export default router;
