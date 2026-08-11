import { Router } from "express";
import { createDocument } from "../controllers/documentController.js";

const router = Router();

router.post("/", createDocument);

export default router;