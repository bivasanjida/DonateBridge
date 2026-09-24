/**
 * pickupRequestRoutes - Request endpoints for NGO and admin workflow actions.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This route set supports the pickup request lifecycle and exposes the admin view
 * of all requests for verification and scheduling.
 */
import express from "express";
import { getAllPickupRequests } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", authenticate, authorize("Admin"), getAllPickupRequests);

export default router;
