import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
