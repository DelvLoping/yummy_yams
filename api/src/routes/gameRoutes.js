import express from "express";
import { launchRoll, checkGame } from "../controllers/gameController.js";
import { clearEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/:eventId/launchRoll", launchRoll);
router.get("/:eventId/clearEvent/", clearEvent);
router.get("/:eventId/checkGame", checkGame);

export default router;
