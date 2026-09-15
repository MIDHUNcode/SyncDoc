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

        if (error) {
            setError("");
        }
    };

    // ==========================================
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
                    <span className="save-status saving">
                        <span className="save-status-dot" />
                        Saving changes...
                    </span>
                );

            case "saved":
                return (
                    <span className="save-status saved">
                        <span className="save-status-dot" />
                        Changes saved
                    </span>
                );

            case "error":
                return (
                    <span className="save-status error">
                        <span className="save-status-dot" />
                        Save failed
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
            <div className="app-error">
                <span>
                    ❌ {error}
                </span>

                <button
                    onClick={() =>
                        setError("")
                    }
                    aria-label="Dismiss error"
                >
                    ×
                </button>
            </div>
        );
    };

    return (
        <div className="syncdoc-app">

            {/* ==================================
                SIDEBAR
            ================================== */}

            <aside className="syncdoc-sidebar">

                {/* LOGO */}

                <div className="syncdoc-logo">
                    <div className="syncdoc-logo-icon">
                        S
                    </div>

                    <div>
                        <div className="syncdoc-logo-text">
                            SyncDoc
                        </div>

                        <div className="syncdoc-logo-subtitle">
                            Collaborative workspace
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}

                <div className="sidebar-section">

                    <div className="sidebar-label">
                        Workspace
                    </div>

                    <button className="sidebar-item active">
                        <span className="sidebar-icon">
                            ▦
                        </span>

                        <span>
                            Documents
                        </span>
                    </button>

                    <button className="sidebar-item">
                        <span className="sidebar-icon">
                            ◷
                        </span>

                        <span>
                            Recent
                        </span>
                    </button>

                    <button className="sidebar-item">
                        <span className="sidebar-icon">
                            ☆
                        </span>

                        <span>
                            Favorites
                        </span>
                    </button>

                </div>

                <div className="sidebar-section">

                    <div className="sidebar-label">
                        Workspace
                    </div>

                    <button
                        className="sidebar-item"
                        onClick={
                            handleCreateDocument
                        }
                        disabled={creating}
                    >
                        <span className="sidebar-icon">
                            ＋
                        </span>

                        <span>
                            {creating
                                ? "Creating..."
                                : "New Document"}
                        </span>
                    </button>

                </div>

                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    <button className="sidebar-item">
                        <span className="sidebar-icon">
                            ⚙
                        </span>

                        <span>
                            Settings
                        </span>
                    </button>

                    <div className="sidebar-user">

                        <div className="sidebar-avatar">
                            M
                        </div>

                        <div className="sidebar-user-info">
                            <strong>
                                User
                            </strong>

                            <span>
                                Online
                            </span>
                        </div>

                        <span className="online-dot" />

                    </div>

                </div>

            </aside>

            {/* ==================================
                MAIN AREA
            ================================== */}

            <main className="syncdoc-main">

                {/* TOPBAR */}

                <header className="syncdoc-topbar">

                    <div className="topbar-search">
                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search documents..."
                        />

                        <kbd>
                            Ctrl K
                        </kbd>
                    </div>

                    <div className="topbar-actions">

                        <div className="connection-status">
                            <span className="connection-dot" />
                            Connected
                        </div>

                        <div className="topbar-divider" />

                        <button
                            className="icon-button"
                            title="Notifications"
                        >
                            ♢
                        </button>

                        <button className="profile-button">
                            <span className="profile-avatar">
                                M
                            </span>

                            <span>
                                User
                            </span>

                            <span>
                                ▾
                            </span>
                        </button>

                    </div>

                </header>

                {/* CONTENT */}

                <div className="syncdoc-content">

                    {/* DOCUMENT BROWSER */}

                    {!selectedDocument && (
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
                            creating={
                                creating
                            }
                            refreshTrigger={
                                refreshDocuments
                            }
                        />
                    )}

                    {/* ERROR */}

                    {renderError()}

                    {/* LOADING */}

                    {loading && (
                        <div className="loading-state">
                            <div className="loading-spinner" />
                            Loading document...
                        </div>
                    )}

                    {/* DELETE */}

                    {deleting && (
                        <div className="loading-state">
                            Deleting document...
                        </div>
                    )}

                    {/* DOCUMENT EDITOR */}

                    {selectedDocument &&
                        !loading && (
                            <div className="editor-workspace">

                                {/* EDITOR HEADER */}

                                <div className="editor-header">

                                    <button
                                        className="back-button"
                                        onClick={() =>
                                            setSelectedDocument(
                                                null
                                            )
                                        }
                                    >
                                        ←
                                        <span>
                                            Documents
                                        </span>
                                    </button>

                                    <div className="editor-header-right">

                                        {renderSaveStatus()}

                                        <div className="editor-connection">
                                            <span className="connection-dot" />
                                            Live
                                        </div>

                                    </div>

                                </div>

                                {/* EDITOR */}

                                <div className="editor-container">

                                    <DocumentViewer
                                        document={
                                            selectedDocument
                                        }
                                        onChange={
                                            handleDocumentChange
                                        }
                                    />

                                </div>

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}

export default App;