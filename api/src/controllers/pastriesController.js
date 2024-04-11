import Pastries from "../models/Pastries";

export const getPastries = async (req, res) => {
    try {
        const pastries = await Pastries.find();
        res.json(pastries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

