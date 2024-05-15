import Event from "../models/Event.js";

export const newEvent = async (payload) => {
  const { name, open, closedAt } = payload;
  const newEvent = new Event({
    name,
    open,
    closedAt,
  });
  await newEvent.save();
  return getEvent(newEvent._id);
};

export const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return event;
};

export const getEventByName = async (name) => {
  const event = await Event.findOne({ name });
  return event;
};

export const updateEvent = async (eventId, payload) => {
  const { name, open, closedAt } = payload;
  const event = await Event.findById(eventId);
  if (!event) {
    return null;
  }
  if (name) {
    event.name = name;
  }
  if (closedAt) {
    event.closedAt = closedAt;
  }
  if (open !== undefined) {
    if (open) {
      event.open = open;
      event.closedAt = null;
    } else {
      event.open = open;
      event.closedAt = new Date();
    }
  }

  await event.save();
  return getEvent(event._id);
};

export const deleteEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    return null;
  }
  await Event.deleteOne({ _id: eventId });
  return event;
};
