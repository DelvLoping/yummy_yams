// models/User.js
import mongoose from "mongoose";

const pastrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: String,
  stock: Number,
  quantityWon: Number,
});

export default mongoose.model("Pastry", pastrySchema);
