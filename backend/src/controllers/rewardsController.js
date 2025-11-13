import Reward from "../models/Reward.js";
import WasteReport from "../models/WasteReport.js";

// 💰 Calculate reward points
export const calculateRewards = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const reports = await WasteReport.find({ farmerId, status: "completed" });
    const totalQuantity = reports.reduce((sum, r) => sum + r.quantity, 0);

    const points = totalQuantity * 5; // Example: 5 points per item
    res.status(200).json({ farmerId, totalQuantity, points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating rewards" });
  }
};

// 🏆 Redeem rewards
export const redeemReward = async (req, res) => {
  try {
    const { farmerId, points } = req.body;

    if (!farmerId || !points)
      return res.status(400).json({ message: "Missing fields" });

    const reward = await Reward.create({
      farmerId,
      points,
      redeemedAt: new Date(),
    });

    res.status(201).json({ message: "Reward redeemed successfully", reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error redeeming reward" });
  }
};

// 📜 Get reward history
export const getRewardHistory = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const rewards = await Reward.find({ farmerId }).sort({ redeemedAt: -1 });

    res.status(200).json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reward history" });
  }
};
