import express from "express";
import {
  createPastry,
  getPastry,
  getPastries,
  updatePastry,
  deletePastry,
} from "../controllers/pastryController.js";
const router = express.Router();

router.get("/", getPastries);
router.post("/", createPastry);
router.get("/:pastryId", getPastry);
router.put("/:pastryId", updatePastry);
router.delete("/:pastryId", deletePastry);

export default router;
