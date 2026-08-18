import * as Y from "yjs";
import { ASTNode } from "../../types/ast.js";
import { astNodeToYMap } from "./astToYjs.js";

const documents = new Map<string, Y.Doc>();

export const getYDoc = (documentId: string): Y.Doc => {
    let yDoc = documents.get(documentId);

    if (!yDoc) {
        yDoc = new Y.Doc();
        documents.set(documentId, yDoc);

        console.log(`🟢 Yjs document created: ${documentId}`);
    }

    return yDoc;
};

export const initializeYDocFromAST = (
    yDoc: Y.Doc,
    nodes: ASTNode[]
): void => {
    const yNodes = yDoc.getArray<Y.Map<unknown>>("nodes");

    if (yNodes.length > 0) {
        return;
    }

    for (const node of nodes) {
        yNodes.push([astNodeToYMap(node)]);
    }

    console.log(
        `🌳 Yjs document initialized with ${nodes.length} root nodes`
    );
};

export const hasYDoc = (documentId: string): boolean => {
    return documents.has(documentId);
};

export const deleteYDoc = (documentId: string): void => {
    const yDoc = documents.get(documentId);

    if (!yDoc) {
        return;
    }

    yDoc.destroy();
    documents.delete(documentId);

    console.log(`🗑️ Yjs document removed: ${documentId}`);
};

export const getActiveDocumentCount = (): number => {
    return documents.size;
};