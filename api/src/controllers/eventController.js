import Event from "../models/Event.js";
import Pastries from "../models/Pastries.js";
import Roll from "../models/Roll.js";
import { currentEvent } from "../constants/eventConst.js";

export const openEvent = async (req, res) => {
    const { name } = req.body;
    try {
        const newEvent = new Event({ name, open: true });
        await newEvent.save();
        res.status(201).json({ message: "Event opened successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const closeEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.open = false;
        event.closedAt = new Date();
        await event.save();
        res.json({ message: "Event closed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const clearEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.open = true;
        event.closedAt = null;
        await event.save();

        const rolls = await Roll.find({ event: eventId });
        for (const roll of rolls) {
            if (roll.pastryWon) {
                const pastry = await Pastries.findById(roll.pastryWon);
                pastry.quantityWon -= 1;
                await pastry.save();
            }
        }
        await Roll.deleteMany({ event: eventId });

        res.json({ message: "Event cleared successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCurrentEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ name: currentEvent });
        if (!event) {
            return res.status(404).json({ message: "Current event not found" });
        }
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


