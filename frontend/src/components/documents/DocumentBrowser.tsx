import {
    useEffect,
    useMemo,
    useState,
} from "react";

interface DocumentItem {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface DocumentBrowserProps {
    onSelectDocument: (id: string) => void;
    onDeleteDocument?: (id: string) => void;
    refreshTrigger?: number;
    onCreateDocument?: () => void;
    creating?: boolean;

    viewMode?:
        | "all"
        | "recent"
        | "favorites";

    searchQuery?: string;
}

const API_URL =
    "http://localhost:5000/api/documents";

const FAVORITES_KEY =
    "syncdoc-favorites";

function DocumentBrowser({
    onSelectDocument,
    onDeleteDocument,
    refreshTrigger = 0,
    onCreateDocument,
    creating = false,
    viewMode = "all",
    searchQuery = "",
}: DocumentBrowserProps) {
    const [documents, setDocuments] =
        useState<DocumentItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [favorites, setFavorites] =
        useState<string[]>(() => {
            try {
                const saved =
                    localStorage.getItem(
                        FAVORITES_KEY
                    );

                return saved
                    ? JSON.parse(saved)
                    : [];
            } catch {
                return [];
            }
        });

    // ==========================================
    // FETCH DOCUMENTS
    // ==========================================

    useEffect(() => {
        const fetchDocuments =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await fetch(
                            API_URL
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Failed to fetch documents"
                        );
                    }

                    const data =
                        await response.json();

                    setDocuments(
                        data.documents ??
                            []
                    );
                } catch (error) {
                    console.error(
                        "❌ Error fetching documents:",
                        error
                    );

                    setError(
                        "Failed to load documents"
                    );
                } finally {
                    setLoading(false);
                }
            };

        fetchDocuments();
    }, [refreshTrigger]);

    // ==========================================
    // FAVORITES
    // ==========================================

    const toggleFavorite = (
        id: string
    ) => {
        setFavorites(
            (current) => {
                const updated =
                    current.includes(id)
                        ? current.filter(
                              (
                                  favorite
                              ) =>
                                  favorite !==
                                  id
                          )
                        : [
                              ...current,
                              id,
                          ];

                localStorage.setItem(
                    FAVORITES_KEY,
                    JSON.stringify(
                        updated
                    )
                );

                return updated;
            }
        );
    };

    // ==========================================
    // FILTER
    // ==========================================

    const filteredDocuments =
        useMemo(() => {
            let result =
                [...documents];

            // Recent
            if (
                viewMode ===
                "recent"
            ) {
                const sevenDays =
                    7 *
                    24 *
                    60 *
                    60 *
                    1000;

                result =
                    result.filter(
                        (
                            document
                        ) => {
                            const updated =
                                new Date(
                                    document.updatedAt
                                ).getTime();

                            return (
                                Date.now() -
                                    updated <=
                                sevenDays
                            );
                        }
                    );
            }

            // Favorites
            if (
                viewMode ===
                "favorites"
            ) {
                result =
                    result.filter(
                        (
                            document
                        ) =>
                            favorites.includes(
                                document._id
                            )
                    );
            }

            // Search
            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (query) {
                result =
                    result.filter(
                        (
                            document
                        ) =>
                            document.title
                                .toLowerCase()
                                .includes(
                                    query
                                )
                    );
            }

            return result;
        }, [
            documents,
            favorites,
            viewMode,
            searchQuery,
        ]);

    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDate = (
        date: string
    ) => {
        return new Date(
            date
        ).toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    // ==========================================
    // PAGE TITLE
    // ==========================================

    const getTitle = () => {
        switch (
            viewMode
        ) {
            case "recent":
                return "Recent Documents";

            case "favorites":
                return "Favorite Documents";

            default:
                return "Documents";
        }
    };

    const getSubtitle = () => {
        switch (
            viewMode
        ) {
            case "recent":
                return "Documents you've worked on recently.";

            case "favorites":
                return "Your saved and frequently used documents.";

            default:
                return "Create, edit and collaborate on your documents.";
        }
    };

    return (
        <div className="dashboard">

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="dashboard-header">

                <div className="page-heading">

                    <div className="page-heading-icon">
                        ✎
                    </div>

                    <div>
                        <h1 className="dashboard-title">
                            {getTitle()}
                        </h1>

                        <p className="dashboard-subtitle">
                            {getSubtitle()}
                        </p>
                    </div>

                </div>

                {onCreateDocument && (
                    <button
                        className="primary-button"
                        onClick={
                            onCreateDocument
                        }
                        disabled={
                            creating
                        }
                    >
                        <span>
                            ＋
                        </span>

                        {creating
                            ? "Creating..."
                            : "Create New Document"}
                    </button>
                )}

            </div>

            {/* ==================================
                STATS
            ================================== */}

            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon purple">
                        ▣
                    </div>

                    <div>
                        <div className="stat-label">
                            Total Documents
                        </div>

                        <div className="stat-value">
                            {
                                documents.length
                            }
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue">
                        ◷
                    </div>

                    <div>
                        <div className="stat-label">
                            Recent
                        </div>

                        <div className="stat-value">
                            {
                                documents.filter(
                                    (
                                        document
                                    ) => {
                                        const updated =
                                            new Date(
                                                document.updatedAt
                                            ).getTime();

                                        return (
                                            Date.now() -
                                                updated <
                                            7 *
                                                24 *
                                                60 *
                                                60 *
                                                1000
                                        );
                                    }
                                ).length
                            }
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        ●
                    </div>

                    <div>
                        <div className="stat-label">
                            Collaboration
                        </div>

                        <div className="stat-value live-value">
                            Live
                        </div>
                    </div>
                </div>

            </div>

            {/* ==================================
                DOCUMENT SECTION
            ================================== */}

            <div className="documents-section-header">

                <div>
                    <h2 className="documents-section-title">
                        {getTitle()}
                    </h2>

                    <span className="documents-count">
                        {
                            filteredDocuments.length
                        }{" "}
                        document
                        {filteredDocuments.length !==
                        1
                            ? "s"
                            : ""}
                    </span>
                </div>

            </div>

            {/* ==================================
                LOADING
            ================================== */}

            {loading && (
                <div className="loading-state">
                    <div className="loading-spinner" />

                    <span>
                        Loading documents...
                    </span>
                </div>
            )}

            {/* ==================================
                ERROR
            ================================== */}

            {!loading &&
                error && (
                    <div className="error-state">
                        {error}
                    </div>
                )}

            {/* ==================================
                EMPTY
            ================================== */}

            {!loading &&
                !error &&
                filteredDocuments.length ===
                    0 && (
                    <div className="documents-empty">

                        <div className="documents-empty-icon">
                            {viewMode ===
                            "favorites"
                                ? "☆"
                                : "▣"}
                        </div>

                        <h3>
                            {viewMode ===
                            "favorites"
                                ? "No favorite documents"
                                : searchQuery
                                ? "No matching documents"
                                : "No documents yet"}
                        </h3>

                        <p>
                            {viewMode ===
                            "favorites"
                                ? "Star a document to add it to your favorites."
                                : searchQuery
                                ? "Try another search term."
                                : "Create your first document to get started."}
                        </p>

                        {!searchQuery &&
                            viewMode !==
                                "favorites" &&
                            onCreateDocument && (
                                <button
                                    className="primary-button"
                                    onClick={
                                        onCreateDocument
                                    }
                                >
                                    ＋ Create Document
                                </button>
                            )}

                    </div>
                )}

            {/* ==================================
                DOCUMENT GRID
            ================================== */}

            {!loading &&
                !error &&
                filteredDocuments.length >
                    0 && (
                    <div className="documents-grid">

                        {filteredDocuments.map(
                            (
                                document
                            ) => {
                                const isFavorite =
                                    favorites.includes(
                                        document._id
                                    );

                                return (
                                    <div
                                        key={
                                            document._id
                                        }
                                        className="document-card"
                                    >

                                        {/* CARD HEADER */}

                                        <div className="document-card-top">

                                            <div className="document-icon">
                                                ▤
                                            </div>

                                            <div className="document-card-actions">

                                                <button
                                                    className={`favorite-button ${
                                                        isFavorite
                                                            ? "favorite-active"
                                                            : ""
                                                    }`}
                                                    onClick={(
                                                        event
                                                    ) => {
                                                        event.stopPropagation();

                                                        toggleFavorite(
                                                            document._id
                                                        );
                                                    }}
                                                    title={
                                                        isFavorite
                                                            ? "Remove from favorites"
                                                            : "Add to favorites"
                                                    }
                                                >
                                                    {isFavorite
                                                        ? "★"
                                                        : "☆"}
                                                </button>

                                                {onDeleteDocument && (
                                                    <button
                                                        className="document-menu"
                                                        onClick={(
                                                            event
                                                        ) => {
                                                            event.stopPropagation();

                                                            const confirmed =
                                                                window.confirm(
                                                                    `Delete "${document.title}"?`
                                                                );

                                                            if (
                                                                confirmed
                                                            ) {
                                                                onDeleteDocument(
                                                                    document._id
                                                                );
                                                            }
                                                        }}
                                                        title="Delete document"
                                                    >
                                                        ⋮
                                                    </button>
                                                )}

                                            </div>

                                        </div>

                                        {/* TITLE */}

                                        <button
                                            className="document-card-click"
                                            onClick={() =>
                                                onSelectDocument(
                                                    document._id
                                                )
                                            }
                                        >
                                            <h3 className="document-title">
                                                {
                                                    document.title
                                                }
                                            </h3>

                                            <p className="document-description">
                                                Collaborative AST document
                                            </p>
                                        </button>

                                        {/* META */}

                                        <div className="document-format">
                                            <span>
                                                A4
                                            </span>

                                            <span>
                                                Structured Document
                                            </span>
                                        </div>

                                        <div className="document-meta-grid">

                                            <div>
                                                <span>
                                                    UPDATED
                                                </span>

                                                <strong>
                                                    {
                                                        formatDate(
                                                            document.updatedAt
                                                        )
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    STATUS
                                                </span>

                                                <strong className="status-online">
                                                    <i />
                                                    Live
                                                </strong>
                                            </div>

                                        </div>

                                        {/* FOOTER */}

                                        <div className="document-footer">

                                            <div className="document-owner">
                                                <span className="mini-avatar">
                                                    M
                                                </span>

                                                <span>
                                                    You
                                                </span>
                                            </div>

                                            <button
                                                className="edit-document-button"
                                                onClick={() =>
                                                    onSelectDocument(
                                                        document._id
                                                    )
                                                }
                                            >
                                                Edit
                                                <span>
                                                    →
                                                </span>
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </div>
    );
}

export default DocumentBrowser;