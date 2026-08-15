import { useEffect, useState } from "react";

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

                setDocuments(data.documents);
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

    return (
        <div>
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    marginBottom: "20px",
                }}
            >
                <h2>Documents</h2>

                {onCreateDocument && (
                    <button
                        onClick={
                            onCreateDocument
                        }
                        disabled={creating}
                        style={{
                            padding:
                                "10px 16px",
                            border: "none",
                            borderRadius:
                                "6px",
                            cursor: creating
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {creating
                            ? "Creating..."
                            : "+ New Document"}
                    </button>
                )}
            </div>

            {/* LOADING */}
            {loading && (
                <p>
                    Loading documents...
                </p>
            )}

            {/* ERROR */}
            {error && (
                <p
                    style={{
                        color: "red",
                    }}
                >
                    {error}
                </p>
            )}

            {/* EMPTY */}
            {!loading &&
                !error &&
                documents.length === 0 && (
                    <p>
                        No documents found.
                    </p>
                )}

            {/* DOCUMENT LIST */}
            {!loading &&
                documents.map((document) => (
                    <div
                        key={document._id}
                        style={{
                            border:
                                "1px solid #ddd",
                            padding: "12px",
                            marginBottom:
                                "10px",
                            borderRadius:
                                "8px",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            gap: "15px",
                        }}
                    >
                        {/* DOCUMENT INFO */}
                        <div
                            onClick={() =>
                                onSelectDocument(
                                    document._id
                                )
                            }
                            style={{
                                flex: 1,
                                cursor:
                                    "pointer",
                            }}
                        >
                            <h3>
                                {
                                    document.title
                                }
                            </h3>

                            <p>
                                Updated:{" "}
                                {new Date(
                                    document.updatedAt
                                ).toLocaleString()}
                            </p>
                        </div>

                        {/* DELETE BUTTON */}
                        {onDeleteDocument && (
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();

                                    onDeleteDocument(
                                        document._id
                                    );
                                }}
                                style={{
                                    padding:
                                        "8px 12px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "6px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
        </div>
    );
}

export default DocumentBrowser;