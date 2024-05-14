import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pastryRoutes from "./routes/pastryRoutes.js";
import rollRoutes from "./routes/rollRoutes.js";
import { connectToDatabase } from "./services/databasesServices.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/game", authenticateToken, gameRoutes);
app.use("/event", authenticateToken, eventRoutes);
app.use("/user", authenticateToken, userRoutes);
app.use("/pastry", authenticateToken, pastryRoutes);
app.use("/roll", authenticateToken, rollRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
