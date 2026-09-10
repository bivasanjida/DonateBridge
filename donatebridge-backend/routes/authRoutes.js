import express from "express";
import {
  register,
  login,
  logout,
  me,
  updateProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.patch("/me", authenticate, updateProfile);

export default router;
