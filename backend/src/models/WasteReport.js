// backend/models/WasteReport.js
import mongoose from "mongoose";

const wasteReportSchema = new mongoose.Schema({
  farmer_id: { type: String, required: true },
  waste_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: String,
  location: String,
  status: { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("WasteReport", wasteReportSchema);
