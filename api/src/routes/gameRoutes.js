import express from "express";
import { launchRoll } from "../controllers/gameController.js";
import { clearEvent, closeEvent, getCurrentEvent, openEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get('/launchRoll', launchRoll);
router.post('/openEvent', openEvent);
router.get('/clearEvent/:eventId', clearEvent);
router.post('/closeEvent', closeEvent);
router.get('/currentEvent', getCurrentEvent);

export default router;
