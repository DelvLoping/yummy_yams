import User from "../models/User.js";
import { getRoll } from "./RollService.js";
import bcrypt from "bcryptjs";

export const newUser = async (payload) => {
  const { username, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
  });
  await newUser.save();
  return await getUser(newUser._id);
};

export const getUser = async (userId) => {
  const user = await User.findById(userId, { password: 0 });
  user.rolls = await Promise.all(
    user.rolls.map(async (roll) => {
      const rollObj = await getRoll(roll);
      return rollObj;
    })
  );
  return user;
};

export const updateUser = async (userId, payload) => {
  const { username, password, rolls } = payload;
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  if (username) {
    user.username = username;
  }
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  if (rolls) {
    user.rolls = rolls;
  }
  await user.save();
  return await getUser(user._id);
};

export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  await user.delete();
  return user;
};
