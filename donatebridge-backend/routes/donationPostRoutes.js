import express from "express";
import {
  listDonationPosts,
  getDonationPostById,
  seedDonationPosts,
} from "../controllers/donationPostController.js";

const router = express.Router();

router.get("/seed", seedDonationPosts);
router.get("/", listDonationPosts);
router.get("/:id", getDonationPostById);

export default router;
