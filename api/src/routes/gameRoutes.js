import express from "express";
import { launchRoll } from "../controllers/gameController.js";
import { clearEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/:eventId/launchRoll", launchRoll);
router.get("/:eventId/clearEvent/", clearEvent);

export default router;
