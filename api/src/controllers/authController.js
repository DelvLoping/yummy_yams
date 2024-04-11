import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
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
    //modify to add in token all info of player except password const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "1h",});
    const token = jwt.sign({ userId: user._id, username: user.username, rolls: user.rolls, pastriesWon: user.pastriesWon }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
