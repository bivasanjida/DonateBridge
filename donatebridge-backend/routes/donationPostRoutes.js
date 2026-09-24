import express from "express";
import {
  listDonationPosts,
  getDonationPostById,
  seedDonationPosts,
  createDonationPost,
  updateDonationPost,
  deleteDonationPost,
  getMyDonationPosts,
} from "../controllers/donationPostController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/seed", seedDonationPosts);
router.get("/", listDonationPosts);
router.get("/mine", authenticate, authorize("Donor"), getMyDonationPosts);
router.post("/", authenticate, authorize("Donor"), createDonationPost);
router.patch("/:id", authenticate, authorize("Donor"), updateDonationPost);
router.delete("/:id", authenticate, authorize("Donor"), deleteDonationPost);
router.get("/:id", getDonationPostById);

export default router;
