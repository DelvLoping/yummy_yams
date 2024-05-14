import express from "express";
import {
  createRoll,
  getRolls,
  getRoll,
  updateRoll,
  deleteRoll,
} from "../controllers/rollController.js";
const router = express.Router();

router.get("/", getRolls);
router.post("/", createRoll);
router.get("/:rollId", getRoll);
router.put("/:rollId", updateRoll);
router.delete("/:rollId", deleteRoll);

export default router;
