import { ROLE_ADMIN } from "../constants/userConst.js";
import Roll from "../models/Roll.js";
import User from "../models/User.js";
import {
  getRoll as getRollService,
  newRoll as newRollService,
  updateRoll as updateRollService,
  deleteRoll as deleteRollService,
} from "../services/RollService.js";

export const getRolls = async (req, res) => {
  try {
    const rolls = await Roll.find();
    res.json(rolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoll = async (req, res) => {
  const { rollId } = req.params;
  try {
    const roll = await getRollService(rollId);
    res.json(roll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoll = async (req, res) => {
  const { name, diceValues, winCombination, pastryWon, event } = req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const roll = await newRollService({
      name,
      diceValues,
      winCombination,
      pastryWon,
      event,
    });
    res.status(201).json(roll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoll = async (req, res) => {
  const { rollId } = req.params;
  const { name, diceValues, winCombination, pastryWon, createdAt, event } =
    req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const roll = await updateRollService(rollId, {
      name,
      diceValues,
      winCombination,
      pastryWon,
      createdAt,
      event,
    });
    if (!roll) {
      return res.status(404).json({ message: "Roll not found" });
    }
    res.json(roll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoll = async (req, res) => {
  const { rollId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const roll = await deleteRollService(rollId);
    if (!roll) {
      return res.status(404).json({ message: "Roll not found" });
    }
    res.json({ message: "Roll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
