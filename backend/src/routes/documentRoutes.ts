import { Router } from "express";
import Document from "../models/Document.js";

const router = Router();

/**
 * GET /api/documents
 * Get all documents
 */
router.get("/", async (_req, res) => {
    try {
        const documents = await Document.find()
            .select("title createdAt updatedAt")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: documents.length,
            documents,
        });
    } catch (error) {
        console.error("❌ Error fetching documents:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch documents",
        });
    }
});

/**
 * GET /api/documents/:id
 * Get a single document with its complete AST
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        res.status(200).json({
            success: true,
            document,
        });
    } catch (error) {
        console.error("❌ Error fetching document:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch document",
        });
    }
});

/**
 * POST /api/documents
 * Create a new document
 */
router.post("/", async (req, res) => {
    try {
        const { title, nodes } = req.body;

        // Basic request validation
        if (!title || typeof title !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!Array.isArray(nodes)) {
            return res.status(400).json({
                success: false,
                message: "Nodes must be an array",
            });
        }

        const document = await Document.create({
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

        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create document",
        });
    }
});

/**
 * PUT /api/documents/:id
 * Update an existing document
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, nodes } = req.body;

        // Basic validation
        if (!title || typeof title !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!Array.isArray(nodes)) {
            return res.status(400).json({
                success: false,
                message: "Nodes must be an array",
            });
        }

        // Find existing document
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        // Update fields
        document.title = title;
        document.nodes = nodes;

        // Save triggers the existing AST pre-save validation
        await document.save();

        res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document,
        });
    } catch (error) {
        console.error("❌ Error updating document:", error);

        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update document",
        });
    }
});

/**
 * DELETE /api/documents/:id
 * Delete an existing document
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        await Document.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("❌ Error deleting document:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete document",
        });
    }
});

export default router;