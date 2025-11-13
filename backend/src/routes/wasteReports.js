// backend/routes/wasteReports.js
import express from "express";
import WasteReport from "../models/WasteReport.js";

const router = express.Router();

// GET /api/waste-reports/:farmer_id
router.get("/:farmer_id", async (req, res) => {
  try {
    const reports = await WasteReport.find({ farmer_id: req.params.farmer_id })
      .sort({ created_at: -1 })
      .limit(10);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/waste-reports (already added)
router.post("/", async (req, res) => {
  try {
    const newReport = await WasteReport.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
