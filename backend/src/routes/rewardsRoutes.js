import express from "express";
import {
  calculateRewards,
  redeemReward,
  getRewardHistory,
} from "../controllers/rewardsController.js";

const router = express.Router();

// Calculate reward points
router.get("/calculate/:farmerId", calculateRewards);

// Redeem reward
router.post("/redeem", redeemReward);

// Get reward history
router.get("/history/:farmerId", getRewardHistory);

export default router;
