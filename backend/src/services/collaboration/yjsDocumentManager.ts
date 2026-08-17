import * as Y from "yjs";

const documents = new Map<string, Y.Doc>();

/**
 * Get an existing Yjs document or create a new one.
 */
export const getYDoc = (documentId: string): Y.Doc => {
    let yDoc = documents.get(documentId);

    if (!yDoc) {
        yDoc = new Y.Doc();
        documents.set(documentId, yDoc);

        console.log(`🟢 Yjs document created: ${documentId}`);
    }

    return yDoc;
};

/**
 * Check whether a Yjs document is currently active.
 */
export const hasYDoc = (documentId: string): boolean => {
    return documents.has(documentId);
};

/**
 * Remove a Yjs document from memory.
 */
export const deleteYDoc = (documentId: string): void => {
    const yDoc = documents.get(documentId);

    if (!yDoc) {
        return;
    }

    yDoc.destroy();
    documents.delete(documentId);

    console.log(`🗑️ Yjs document removed: ${documentId}`);
};

/**
 * Get the number of active collaborative documents.
 */
export const getActiveDocumentCount = (): number => {
    return documents.size;
};