import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import farmerRoutes from "./routes/farmerRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import wasteReports from "./routes/wasteReports.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
// In production: allow only the configured FRONTEND_URL.
// In development: allow localhost origins (any port) so Vite can pick a free port.
const isDev = process.env.NODE_ENV !== "production";
const configuredFrontend = process.env.FRONTEND_URL;
if (isDev) {
  app.use(
    cors({
      origin: "*", // allow all origins in dev
    })
  );
} else {
  app.use(
    cors({
      origin: configuredFrontend,
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/waste-reports", wasteReports);
app.use("/api/farmers", farmerRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("🌿 EcoBarter API is live!"));

// Error Handler
app.use(errorHandler);

export default app;
