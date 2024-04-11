import mongoose from 'mongoose';

const rollSchema = new mongoose.Schema({
    diceValues: [Number],
    winCombination: { type: String },
    pastryWon: { type: mongoose.Schema.Types.ObjectId, ref: 'Pastry' },
    createdAt: { type: Date, default: Date.now },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
});

const Roll = mongoose.model("Roll", rollSchema);

export default Roll;
