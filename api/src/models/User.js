import mongoose from "mongoose";
import { ROLE_USER } from "../constants/userConst.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Roll", default: [] }],
  role: { type: String, default: ROLE_USER },
});

const User = mongoose.model("User", userSchema);

export default User;
