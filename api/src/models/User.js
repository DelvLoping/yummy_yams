import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pastriesWon: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pastries' }],
    rolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roll' }]
});

const User = mongoose.model("User", userSchema);

export default User;
