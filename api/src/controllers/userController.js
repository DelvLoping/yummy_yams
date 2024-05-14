import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  getUser as getUserService,
  newUser as newUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../services/UserService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = await newUserService({ username, password });
    res.status(201).json({ ...newUser, password: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUserService(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, password, rolls } = req.body;
  try {
    const user = await updateUserService(userId, { username, password, rolls });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await deleteUserService(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
