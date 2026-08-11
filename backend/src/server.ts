import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SyncDoc API",
    message: "Backend is running",
  });
});

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 SyncDoc API running on port ${PORT}`);
  });
};

startServer();