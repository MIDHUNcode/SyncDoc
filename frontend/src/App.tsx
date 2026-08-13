import { useState } from "react";
import DocumentBrowser from "./components/documents/DocumentBrowser";
import DocumentViewer from "./components/documents/DocumentViewer";
import { getDocumentById } from "./services/documentService";
import type { DocumentData } from "./types/document";

function App() {
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentData | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSelectDocument = async (id: string) => {
        try {
            setLoading(true);
            setError("");

            const document = await getDocumentById(id);

            setSelectedDocument(document);
        } catch (error) {
            console.error(
                "❌ Error loading document:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load document"
            );

            setSelectedDocument(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>SyncDoc</h1>

            <p>
                Collaborative Document Engine with AST
            </p>

            <DocumentBrowser
                onSelectDocument={handleSelectDocument}
            />

            {loading && (
                <p>Loading document...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {selectedDocument && !loading && (
                <DocumentViewer
                    title={selectedDocument.title}
                    nodes={selectedDocument.nodes}
                />
            )}
        </div>
    );
}

export default App;