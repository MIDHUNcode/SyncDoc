import { Request, Response } from "express";
import DocumentModel from "../models/Document.js";

export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, nodes } = req.body;

    const document = await DocumentModel.create({
      title,
      nodes,
    });

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      document,
    });
  } catch (error) {
    console.error("❌ Error creating document:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create document",
    });
  }
};