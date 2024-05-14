import { ROLE_ADMIN } from "../constants/userConst.js";
import Pastry from "../models/Pastry.js";
import User from "../models/User.js";
import {
  getPastry as getPastryService,
  newPastry as newPastryService,
  updatePastry as updatePastryService,
  deletePastry as deletePastryService,
} from "../services/PastryService.js";
export const getPastries = async (req, res) => {
  try {
    const pastries = await Pastry.find();
    res.json(pastries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPastry = async (req, res) => {
  const { pastryId } = req.params;
  try {
    const pastry = await getPastryService(pastryId);
    if (!pastry) {
      return res.status(404).json({ message: "Pastry not found" });
    }
    res.json(pastry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPastry = async (req, res) => {
  const { name, image, stock, quantityWon } = req.body;
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
    const pastry = await newPastryService({ name, image, stock, quantityWon });
    if (!pastry) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    res.status(201).json(pastry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePastry = async (req, res) => {
  const { pastryId } = req.params;
  const { name, image, stock, quantityWon } = req.body;
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
    const pastry = await updatePastryService(pastryId, {
      name,
      image,
      stock,
      quantityWon,
    });
    if (!pastry) {
      return res.status(404).json({ message: "Pastry not found" });
    }
    res.json(pastry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePastry = async (req, res) => {
  const { pastryId } = req.params;
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
    const pastry = await deletePastryService(pastryId);
    if (!pastry) {
      return res.status(404).json({ message: "Pastry not found" });
    }
    res.json({ message: "Pastry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
