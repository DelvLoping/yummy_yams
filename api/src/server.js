import express from "express";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import Pastries from "./models/Pastries.js";
import { connectToDatabase } from "./services/databasesServices.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/game", authenticateToken, gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
