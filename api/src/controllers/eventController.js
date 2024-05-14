import { ROLE_ADMIN } from "../constants/userConst.js";
import Event from "../models/Event.js";
import Pastry from "../models/Pastry.js";
import Roll from "../models/Roll.js";
import User from "../models/User.js";
import {
  getEvent as getEventService,
  newEvent as newEventService,
  updateEvent as updateEventService,
  deleteEvent as deleteEventService,
} from "../services/EventService.js";
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await getEventService(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  const { name, open, closedAt } = req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const event = newEventService({ name, open, closedAt });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, open, closedAt } = req.body;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const event = await updateEventService(eventId, { name, open, closedAt });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const event = await deleteEventService(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closeEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.open = false;
    event.closedAt = new Date();
    await event.save();
    res.json({ message: "Event closed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.role === ROLE_ADMIN) {
      return res.status(403).json({ message: "Unauthorized" });
    }
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
        for (const pastryId of roll.pastryWon) {
          const pastry = await Pastry.findById(pastryId);
          pastry.quantityWon -= 1;
          await pastry.save();
        }
      }
    }
    await Roll.deleteMany({ event: eventId });
    const existingRollIds = await Roll.find({}, "_id").lean();
    const existingRollIdsArray = existingRollIds.map((roll) => roll._id);
    await User.updateMany(
      {},
      { $pull: { rolls: { $nin: existingRollIdsArray } } }
    );

    res.json({ message: "Event cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
