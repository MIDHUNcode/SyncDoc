import type {
    DocumentData,
    DocumentItem,
} from "../types/document";

const API_URL = "http://localhost:5000/api/documents";

interface DocumentsResponse {
    success: boolean;
    count: number;
    documents: DocumentItem[];
}

interface DocumentResponse {
    success: boolean;
    document: DocumentData;
}

export const getDocuments = async (): Promise<DocumentItem[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    const data: DocumentsResponse = await response.json();

    return data.documents;
};

export const getDocumentById = async (
    id: string
): Promise<DocumentData> => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Document not found");
        }

        throw new Error("Failed to fetch document");
    }

    const data: DocumentResponse = await response.json();

    return data.document;
};