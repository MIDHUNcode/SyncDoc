import { useEffect, useMemo, useState } from "react";

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
}

const API_URL =
    "http://localhost:5000/api/documents";

function DocumentBrowser({
    onSelectDocument,
    onDeleteDocument,
    refreshTrigger = 0,
    onCreateDocument,
    creating = false,
}: DocumentBrowserProps) {
    const [documents, setDocuments] =
        useState<DocumentItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch documents"
                    );
                }

                const data =
                    await response.json();

                setDocuments(
                    data.documents ?? []
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

    const filteredDocuments =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return documents;
            }

            return documents.filter(
                (document) =>
                    document.title
                        .toLowerCase()
                        .includes(query)
            );
        }, [documents, search]);

    const formatDate = (
        date: string
    ) => {
        return new Date(
            date
        ).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <div className="dashboard">

            {/* DASHBOARD HEADER */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        Good evening 👋
                    </h1>

                    <p className="dashboard-subtitle">
                        Manage your collaborative
                        documents from one place.
                    </p>
                </div>

                {onCreateDocument && (
                    <button
                        className="primary-button"
                        onClick={
                            onCreateDocument
                        }
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "+ New Document"}
                    </button>
                )}
            </div>

            {/* STATISTICS */}
            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-label">
                        Total Documents
                    </div>

                    <div className="stat-value">
                        {documents.length}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Recently Updated
                    </div>

                    <div className="stat-value">
                        {
                            documents.filter(
                                (document) => {
                                    const updated =
                                        new Date(
                                            document.updatedAt
                                        ).getTime();

                                    const day =
                                        24 *
                                        60 *
                                        60 *
                                        1000;

                                    return (
                                        Date.now() -
                                            updated <
                                        day
                                    );
                                }
                            ).length
                        }
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Collaboration
                    </div>

                    <div className="stat-value">
                        <span
                            style={{
                                color:
                                    "var(--success)",
                            }}
                        >
                            ● Live
                        </span>
                    </div>
                </div>

            </div>

            {/* DOCUMENT SECTION */}
            <div className="documents-section-header">

                <div>
                    <h2 className="documents-section-title">
                        Your Documents
                    </h2>

                    <span className="documents-count">
                        {filteredDocuments.length}{" "}
                        document
                        {filteredDocuments.length !==
                        1
                            ? "s"
                            : ""}
                    </span>
                </div>

                {/* SEARCH */}
                <div className="topbar-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-state">
                    Loading your documents...
                </div>
            )}

            {/* ERROR */}
            {!loading && error && (
                <div className="error-state">
                    {error}
                </div>
            )}

            {/* EMPTY */}
            {!loading &&
                !error &&
                filteredDocuments.length ===
                    0 && (
                    <div className="documents-empty">

                        <div className="documents-empty-icon">
                            📄
                        </div>

                        <h3>
                            {search
                                ? "No matching documents"
                                : "No documents yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try a different search term."
                                : "Create your first document to get started."}
                        </p>

                        {!search &&
                            onCreateDocument && (
                                <button
                                    className="primary-button"
                                    onClick={
                                        onCreateDocument
                                    }
                                    disabled={
                                        creating
                                    }
                                >
                                    {creating
                                        ? "Creating..."
                                        : "+ Create Document"}
                                </button>
                            )}

                    </div>
                )}

            {/* DOCUMENT CARDS */}
            {!loading &&
                !error &&
                filteredDocuments.length >
                    0 && (
                    <div className="documents-grid">

                        {filteredDocuments.map(
                            (document) => (
                                <div
                                    key={
                                        document._id
                                    }
                                    className="document-card"
                                    onClick={() =>
                                        onSelectDocument(
                                            document._id
                                        )
                                    }
                                >

                                    {/* CARD TOP */}
                                    <div className="document-card-top">

                                        <div className="document-icon">
                                            📄
                                        </div>

                                        <button
                                            className="document-menu"
                                            onClick={(
                                                event
                                            ) => {
                                                event.stopPropagation();

                                                if (
                                                    onDeleteDocument
                                                ) {
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
                                                }
                                            }}
                                            title="Delete document"
                                        >
                                            ⋮
                                        </button>

                                    </div>

                                    {/* TITLE */}
                                    <h3 className="document-title">
                                        {
                                            document.title
                                        }
                                    </h3>

                                    {/* DATE */}
                                    <div className="document-date">
                                        Updated{" "}
                                        {formatDate(
                                            document.updatedAt
                                        )}
                                    </div>

                                    {/* FOOTER */}
                                    <div className="document-footer">

                                        <div className="document-status">
                                            <span className="document-status-dot" />

                                            Ready for
                                            collaboration
                                        </div>

                                        <span
                                            style={{
                                                color:
                                                    "var(--text-muted)",
                                                fontSize:
                                                    "16px",
                                            }}
                                        >
                                            →
                                        </span>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

        </div>
    );
}

export default DocumentBrowser;