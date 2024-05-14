// models/User.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  open: Boolean,
  closedAt: Date,
});

export default mongoose.model("Event", eventSchema);
