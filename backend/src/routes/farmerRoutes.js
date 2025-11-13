import express from "express";
import WasteReport from "../models/WasteReport.js";
import Reward from "../models/Reward.js";

const router = express.Router();

// GET farmer stats
router.get("/stats/:id", async (req, res) => {
  try {
    const farmerId = req.params.id;

    // Fetch rewards (tree seedlings + compost credits)
    const rewards = await Reward.find({ farmer_id: farmerId });
    const treeSeedlings = rewards.reduce(
      (sum, r) => sum + (r.tree_seedlings || 0),
      0
    );
    const compostCredits = rewards.reduce(
      (sum, r) => sum + (r.compost_credits || 0),
      0
    );

    // Fetch pending waste reports
    const pendingReports = await WasteReport.countDocuments({
      farmer_id: farmerId,
      status: "pending",
    });

    res.json({ treeSeedlings, compostCredits, pendingReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET waste reports for a farmer
// GET /api/farmer/waste-reports/:id
router.get("/waste-reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Use the schema field names (farmer_id and created_at)
    const reports = await WasteReport.find({ farmer_id: id })
      .sort({ created_at: -1 })
      .limit(10);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
