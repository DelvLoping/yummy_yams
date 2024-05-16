// models/User.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  open: Boolean,
  closedAt: Date,
});

export default mongoose.model("Event", eventSchema);
