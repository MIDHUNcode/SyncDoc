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

interface CreateDocumentResponse {
    success: boolean;
    message: string;
    document: DocumentData;
}

// ==========================================
// GET ALL DOCUMENTS
// ==========================================
export const getDocuments = async (): Promise<DocumentItem[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch documents");
    }

    const data: DocumentsResponse =
        await response.json();

    return data.documents;
};

// ==========================================
// GET DOCUMENT BY ID
// ==========================================
export const getDocumentById = async (
    id: string
): Promise<DocumentData> => {
    const response = await fetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Document not found");
        }

        throw new Error("Failed to fetch document");
    }

    const data: DocumentResponse =
        await response.json();

    return data.document;
};

// ==========================================
// CREATE DOCUMENT
// ==========================================
export const createDocument = async (
    title: string,
    nodes: DocumentData["nodes"]
): Promise<DocumentData> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            nodes,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(
            () => null
        );

        throw new Error(
            errorData?.message ||
                "Failed to create document"
        );
    }

    const data: CreateDocumentResponse =
        await response.json();

    return data.document;
};

// ==========================================
// UPDATE DOCUMENT
// ==========================================
export const updateDocument = async (
    id: string,
    document: {
        title: string;
        nodes: DocumentData["nodes"];
    }
): Promise<DocumentData> => {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(document),
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Document not found");
        }

        throw new Error(
            "Failed to update document"
        );
    }

    const data: DocumentResponse =
        await response.json();

    return data.document;
};

// ==========================================
// DELETE DOCUMENT
// ==========================================
export const deleteDocument = async (
    id: string
): Promise<void> => {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete document"
        );
    }
};