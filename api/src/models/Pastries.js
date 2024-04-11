// models/User.js
import mongoose from 'mongoose';

const pastriesSchema = new mongoose.Schema({
    name: String,
    image: String,
    stock: Number,
    quantityWon: Number
});

export default mongoose.model('Pastries', pastriesSchema);
