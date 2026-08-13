import { useEffect, useState } from "react";

interface DocumentItem {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface DocumentBrowserProps {
    onSelectDocument: (id: string) => void;
}

const API_URL = "http://localhost:5000/api/documents";

function DocumentBrowser({
    onSelectDocument,
}: DocumentBrowserProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch documents");
                }

                const data = await response.json();

                setDocuments(data.documents);
            } catch (error) {
                console.error("❌ Error fetching documents:", error);

                setError("Failed to load documents");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    if (loading) {
        return <p>Loading documents...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (documents.length === 0) {
        return <p>No documents found.</p>;
    }

    return (
        <div>
            <h2>Documents</h2>

            {documents.map((document) => (
                <div
                    key={document._id}
                    onClick={() => onSelectDocument(document._id)}
                    style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    <h3>{document.title}</h3>

                    <p>
                        Updated:{" "}
                        {new Date(
                            document.updatedAt
                        ).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default DocumentBrowser;