import Reward from "./models/Reward.js";
import User from  "./models/User.js";

export const giveReward = async (userId, points, type) => {
  const reward = await Reward.create({
    user: userId,
    pointsEarned: points,
    rewardType: type
  });

  await User.findByIdAndUpdate(userId, { $inc: { points } });

  return reward;
};
