import {
    useEffect,
    useRef,
    useState,
} from "react";

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

type Navigation =
    | "dashboard"
    | "documents"
    | "recent"
    | "favorites"
    | "settings";

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

    const [activeNavigation, setActiveNavigation] =
        useState<Navigation>("dashboard");

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [settingsOpen, setSettingsOpen] =
        useState(false);

    const searchInputRef =
        useRef<HTMLInputElement>(null);

    // ==========================================
    // KEYBOARD SEARCH SHORTCUT
    // ==========================================

    useEffect(() => {
        const handleKeyboardShortcut = (
            event: KeyboardEvent
        ) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();

                searchInputRef.current?.focus();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyboardShortcut
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyboardShortcut
            );
    }, []);

    // ==========================================
    // AUTOSAVE
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

        const timer = setTimeout(
            async () => {
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
            },
            800
        );

        return () =>
            clearTimeout(timer);
    }, [selectedDocument]);

    // ==========================================
    // SELECT DOCUMENT
    // ==========================================

    const handleSelectDocument =
        async (id: string) => {
            try {
                setLoading(true);
                setError("");
                setSaveStatus("idle");

                const document =
                    await getDocumentById(id);

                setSelectedDocument(
                    document
                );
            } catch (error) {
                console.error(
                    "❌ Error loading document:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load the document."
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

    const handleCreateDocument =
        async () => {
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

                setActiveNavigation(
                    "documents"
                );
            } catch (error) {
                console.error(
                    "❌ Error creating document:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to create the document."
                );
            } finally {
                setCreating(false);
            }
        };

    // ==========================================
    // DELETE DOCUMENT
    // ==========================================

    const handleDeleteDocument =
        async (id: string) => {
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
                        : "Unable to delete the document."
                );
            } finally {
                setDeleting(false);
            }
        };

    // ==========================================
    // NAVIGATION
    // ==========================================

    const handleNavigation = (
        navigation: Navigation
    ) => {
        setActiveNavigation(
            navigation
        );

        setSettingsOpen(
            navigation === "settings"
        );

        if (
            navigation !== "settings" &&
            selectedDocument
        ) {
            setSelectedDocument(null);
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
                        Saving
                    </span>
                );

            case "saved":
                return (
                    <span className="save-status saved">
                        <span className="save-status-dot" />
                        Saved
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
    // ERROR
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
                >
                    ×
                </button>
            </div>
        );
    };

    // ==========================================
    // DOCUMENT FILTER
    // ==========================================

    const getDocumentView =
        () => {
            switch (
                activeNavigation
            ) {
                case "recent":
                    return "recent";

                case "favorites":
                    return "favorites";

                default:
                    return "all";
            }
        };

    return (
        <div
            className={`syncdoc-app ${
                sidebarCollapsed
                    ? "sidebar-collapsed"
                    : ""
            }`}
        >

            {/* ==================================
                SIDEBAR
            ================================== */}

            <aside className="syncdoc-sidebar">

                {/* BRAND */}

                <div className="sidebar-brand">

                    <div className="syncdoc-logo">

                        <div className="syncdoc-logo-icon">
                            S
                        </div>

                        {!sidebarCollapsed && (
                            <div>
                                <div className="syncdoc-logo-text">
                                    SyncDoc
                                </div>

                                <div className="syncdoc-logo-subtitle">
                                    SECURE WORKSPACE
                                </div>
                            </div>
                        )}

                    </div>

                    <button
                        className="sidebar-collapse"
                        onClick={() =>
                            setSidebarCollapsed(
                                (value) =>
                                    !value
                            )
                        }
                        title={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {sidebarCollapsed
                            ? "›"
                            : "‹"}
                    </button>

                </div>

                {/* NAVIGATION */}

                <nav className="sidebar-navigation">

                    <div className="sidebar-label">
                        Workspace
                    </div>

                    <button
                        className={`sidebar-item ${
                            activeNavigation ===
                            "dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "dashboard"
                            )
                        }
                        title="Dashboard"
                    >
                        <span className="sidebar-icon">
                            ⌂
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                Dashboard
                            </span>
                        )}
                    </button>

                    <button
                        className={`sidebar-item ${
                            activeNavigation ===
                            "documents"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "documents"
                            )
                        }
                        title="Documents"
                    >
                        <span className="sidebar-icon">
                            ▣
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                Documents
                            </span>
                        )}
                    </button>

                    <button
                        className={`sidebar-item ${
                            activeNavigation ===
                            "recent"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "recent"
                            )
                        }
                        title="Recent"
                    >
                        <span className="sidebar-icon">
                            ◷
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                Recent
                            </span>
                        )}
                    </button>

                    <button
                        className={`sidebar-item ${
                            activeNavigation ===
                            "favorites"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "favorites"
                            )
                        }
                        title="Favorites"
                    >
                        <span className="sidebar-icon">
                            ☆
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                Favorites
                            </span>
                        )}
                    </button>

                    <div className="sidebar-divider" />

                    <div className="sidebar-label">
                        Create
                    </div>

                    <button
                        className="sidebar-create-button"
                        onClick={
                            handleCreateDocument
                        }
                        disabled={creating}
                        title="Create new document"
                    >
                        <span>
                            ＋
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                {creating
                                    ? "Creating..."
                                    : "New Document"}
                            </span>
                        )}
                    </button>

                </nav>

                {/* SIDEBAR FOOTER */}

                <div className="sidebar-footer">

                    <button
                        className={`sidebar-item ${
                            activeNavigation ===
                            "settings"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "settings"
                            )
                        }
                        title="Settings"
                    >
                        <span className="sidebar-icon">
                            ⚙
                        </span>

                        {!sidebarCollapsed && (
                            <span>
                                Settings
                            </span>
                        )}
                    </button>

                    {!sidebarCollapsed && (
                        <div className="sidebar-user">

                            <div className="sidebar-avatar">
                                M
                            </div>

                            <div className="sidebar-user-details">
                                <strong>
                                    User
                                </strong>

                                <span>
                                    Online
                                </span>
                            </div>

                            <span className="online-dot" />

                        </div>
                    )}

                </div>

            </aside>

            {/* ==================================
                MAIN
            ================================== */}

            <main className="syncdoc-main">

                {/* TOP BAR */}

                <header className="syncdoc-topbar">

                    <div className="topbar-search">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            ref={
                                searchInputRef
                            }
                            type="text"
                            placeholder="Search documents..."
                            value={
                                searchQuery
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchQuery(
                                    event.target
                                        .value
                                )
                            }
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

                        <button
                            className="topbar-icon-button"
                            title="Notifications"
                        >
                            ♢
                        </button>

                        <div className="topbar-profile">

                            <div className="profile-avatar">
                                M
                            </div>

                            <div className="profile-details">
                                <strong>
                                    User
                                </strong>

                                <span>
                                    Workspace
                                </span>
                            </div>

                            <span className="profile-arrow">
                                ▾
                            </span>

                        </div>

                    </div>

                </header>

                {/* ==================================
                    PAGE CONTENT
                ================================== */}

                <div className="syncdoc-content">

                    {/* SETTINGS */}

                    {settingsOpen && (
                        <div className="settings-page">

                            <div className="page-heading">
                                <div>
                                    <div className="page-heading-icon">
                                        ⚙
                                    </div>

                                    <div>
                                        <h1>
                                            Settings
                                        </h1>

                                        <p>
                                            Manage your SyncDoc workspace.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">

                                <div className="settings-row">
                                    <div>
                                        <strong>
                                            Workspace
                                        </strong>

                                        <span>
                                            SyncDoc Collaborative Workspace
                                        </span>
                                    </div>

                                    <span className="settings-badge">
                                        Active
                                    </span>
                                </div>

                                <div className="settings-row">
                                    <div>
                                        <strong>
                                            Collaboration
                                        </strong>

                                        <span>
                                            Real-time Yjs synchronization
                                        </span>
                                    </div>

                                    <span className="settings-badge green">
                                        Connected
                                    </span>
                                </div>

                                <div className="settings-row">
                                    <div>
                                        <strong>
                                            Autosave
                                        </strong>

                                        <span>
                                            Documents are saved automatically.
                                        </span>
                                    </div>

                                    <span className="settings-badge green">
                                        Enabled
                                    </span>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* DOCUMENT BROWSER */}

                    {!settingsOpen &&
                        !selectedDocument && (
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
                                viewMode={
                                    getDocumentView()
                                }
                                searchQuery={
                                    searchQuery
                                }
                            />
                        )}

                    {renderError()}

                    {/* LOADING */}

                    {loading && (
                        <div className="loading-state">
                            <div className="loading-spinner" />
                            Loading document...
                        </div>
                    )}

                    {/* DELETING */}

                    {deleting && (
                        <div className="loading-state">
                            Deleting document...
                        </div>
                    )}

                    {/* EDITOR */}

                    {selectedDocument &&
                        !loading && (
                            <div className="editor-workspace">

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