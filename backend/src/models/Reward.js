import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  farmerId: String,
  treeSeedlings: Number,
  compostCredits: Number,
});

export default mongoose.model("Reward", rewardSchema);
