import { useEffect, useState } from "react";

import DocumentBrowser from "./components/documents/DocumentBrowser";
import DocumentViewer from "./components/documents/DocumentViewer";

import {
    createDocument,
    deleteDocument,
    getDocumentById,
    updateDocument,
} from "./services/documentService";

import type { DocumentData } from "./types/document";
import { validateAST } from "./validators/astValidator";

type SaveStatus =
    | "idle"
    | "saving"
    | "saved"
    | "error";

function App() {
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentData | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>("idle");

    const [creating, setCreating] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [refreshDocuments, setRefreshDocuments] =
        useState(0);

    // ==========================================
    // STEP 1 + STEP 2
    // AUTOSAVE + SAVE STATUS
    // ==========================================
    useEffect(() => {
        if (!selectedDocument) return;

        const validation =
            validateAST(
                selectedDocument.nodes
            );

        if (!validation.valid) {
            console.error(
                "❌ AST validation failed:",
                validation.errors
            );

            setSaveStatus("error");

            setError(
                validation.errors.join(" ")
            );

            return;
        }

        setSaveStatus("saving");

        const timer = setTimeout(async () => {
            try {
                await updateDocument(
                    selectedDocument._id,
                    {
                        title:
                            selectedDocument.title,
                        nodes:
                            selectedDocument.nodes,
                    }
                );

                console.log(
                    "✅ Document autosaved"
                );

                setSaveStatus("saved");
            } catch (error) {
                console.error(
                    "❌ Autosave failed:",
                    error
                );

                setSaveStatus("error");

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to save document"
                );
            }
        }, 800);

        return () =>
            clearTimeout(timer);
    }, [selectedDocument]);

    // ==========================================
    // LOAD DOCUMENT
    // ==========================================
    const handleSelectDocument = async (
        id: string
    ) => {
        try {
            setLoading(true);
            setError("");
            setSaveStatus("idle");

            const document =
                await getDocumentById(id);

            setSelectedDocument(document);
        } catch (error) {
            console.error(
                "❌ Error loading document:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to load the document. Please try again."
            );

            setSelectedDocument(null);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DOCUMENT CHANGE
    // ==========================================
    const handleDocumentChange = (
        updatedDocument: DocumentData
    ) => {
        setSelectedDocument(
            updatedDocument
        );

        // Remove old error after user edits
        if (error) {
            setError("");
        }
    };

    // ==========================================
    // STEP 3
    // CREATE DOCUMENT
    // ==========================================
    const handleCreateDocument = async () => {
        try {
            setCreating(true);
            setError("");
            setSaveStatus("idle");

            const newDocument =
                await createDocument(
                    "Untitled Document",
                    []
                );

            console.log(
                "✅ Document created:",
                newDocument
            );

            setSelectedDocument(
                newDocument
            );

            setRefreshDocuments(
                (current) =>
                    current + 1
            );
        } catch (error) {
            console.error(
                "❌ Error creating document:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to create the document. Please try again."
            );
        } finally {
            setCreating(false);
        }
    };

    // ==========================================
    // STEP 4
    // DELETE DOCUMENT
    // ==========================================
    const handleDeleteDocument = async (
        id: string
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this document?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteDocument(id);

            console.log(
                "🗑️ Document deleted successfully"
            );

            if (
                selectedDocument?._id === id
            ) {
                setSelectedDocument(null);
                setSaveStatus("idle");
            }

            setRefreshDocuments(
                (current) =>
                    current + 1
            );
        } catch (error) {
            console.error(
                "❌ Error deleting document:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete the document. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    // ==========================================
    // SAVE STATUS
    // ==========================================
    const renderSaveStatus = () => {
        switch (saveStatus) {
            case "saving":
                return (
                    <span
                        style={{
                            color: "#b45309",
                        }}
                    >
                        Saving...
                    </span>
                );

            case "saved":
                return (
                    <span
                        style={{
                            color: "#15803d",
                        }}
                    >
                        Saved ✓
                    </span>
                );

            case "error":
                return (
                    <span
                        style={{
                            color: "#dc2626",
                        }}
                    >
                        Save failed ✕
                    </span>
                );

            default:
                return null;
        }
    };

    // ==========================================
    // ERROR UI
    // ==========================================
    const renderError = () => {
        if (!error) return null;

        return (
            <div
                style={{
                    marginTop: "20px",
                    padding: "12px 16px",
                    border:
                        "1px solid #fca5a5",
                    borderRadius: "8px",
                    backgroundColor:
                        "#fef2f2",
                    color: "#b91c1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: "15px",
                }}
            >
                <span>
                    ❌ {error}
                </span>

                <button
                    onClick={() =>
                        setError("")
                    }
                    style={{
                        border: "none",
                        background:
                            "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                    }}
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            </div>
        );
    };

    return (
        <div
            style={{
                padding: "30px",
            }}
        >
            <h1>SyncDoc</h1>

            <p>
                Collaborative Document Engine
                with AST
            </p>

            {/* ==================================
                DOCUMENT BROWSER
            ================================== */}

            <DocumentBrowser
                onSelectDocument={
                    handleSelectDocument
                }
                onCreateDocument={
                    handleCreateDocument
                }
                onDeleteDocument={
                    handleDeleteDocument
                }
                creating={creating}
                refreshTrigger={
                    refreshDocuments
                }
            />

            {/* ==================================
                ERROR
            ================================== */}

            {renderError()}

            {/* ==================================
                LOADING DOCUMENT
            ================================== */}

            {loading && (
                <p
                    style={{
                        marginTop: "20px",
                    }}
                >
                    Loading document...
                </p>
            )}

            {/* ==================================
                DELETE STATUS
            ================================== */}

            {deleting && (
                <p
                    style={{
                        marginTop: "20px",
                    }}
                >
                    Deleting document...
                </p>
            )}

            {/* ==================================
                DOCUMENT VIEWER
            ================================== */}

            {selectedDocument &&
                !loading && (
                    <>
                        {/* SAVE STATUS */}

                        <div
                            style={{
                                marginTop:
                                    "20px",
                                marginBottom:
                                    "10px",
                                fontSize:
                                    "14px",
                            }}
                        >
                            {renderSaveStatus()}
                        </div>

                        <DocumentViewer
                            document={
                                selectedDocument
                            }
                            onChange={
                                handleDocumentChange
                            }
                        />
                    </>
                )}
        </div>
    );
}

export default App;