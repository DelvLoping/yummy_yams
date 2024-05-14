import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createJWT } from "../services/JWT.js";
import {
  newUser as newUserService,
  getUser as getUserService,
} from "../services/UserService.js";
import { ROLE_USER } from "../constants/userConst.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const user = await newUserService({ username, password, role: ROLE_USER });
    const token = createJWT({
      userId: user._id,
    });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userId = user._id;
    const token = createJWT({
      userId,
    });
    const userEmbedded = await getUserService(userId);
    res.json({ user: userEmbedded, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await getUserService(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
