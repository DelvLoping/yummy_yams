import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:eventId", getEvent);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

export default router;
