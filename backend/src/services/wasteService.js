import Waste from "../models/Waste.js";

export const logWaste = async (userId, type, weightKg) => {
  const waste = await Waste.create({ user: userId, type, weightKg });
  return waste;
};
