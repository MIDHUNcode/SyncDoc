import * as Y from "yjs";
import { ASTNode } from "../../types/ast.js";
import { astNodeToYMap } from "./astToYjs.js";
import DocumentModel from "../../models/Document.js";

const documents = new Map<string, Y.Doc>();

export const getYDoc = async (
    documentId: string
): Promise<Y.Doc> => {
    let yDoc = documents.get(documentId);

    if (yDoc) {
        return yDoc;
    }

    yDoc = new Y.Doc();
    documents.set(documentId, yDoc);

    /*
     * Load the existing AST from MongoDB
     * when this Y.Doc is created for the first time.
     */
    const document =
        await DocumentModel.findById(documentId).lean();

    if (!document) {
        console.error(
            `❌ Document not found: ${documentId}`
        );

        return yDoc;
    }

    initializeYDocFromAST(
        yDoc,
        document.nodes
    );

    return yDoc;
};

export const initializeYDocFromAST = (
    yDoc: Y.Doc,
    nodes: ASTNode[]
): void => {
    const yNodes =
        yDoc.getArray<Y.Map<unknown>>("nodes");

    if (yNodes.length > 0) {
        return;
    }

    yDoc.transact(() => {
        for (const node of nodes) {
            yNodes.push([
                astNodeToYMap(node),
            ]);
        }
    });
};

export const hasYDoc = (
    documentId: string
): boolean => {
    return documents.has(documentId);
};

export const deleteYDoc = (
    documentId: string
): void => {
    const yDoc =
        documents.get(documentId);

    if (!yDoc) {
        return;
    }

    yDoc.destroy();

    documents.delete(documentId);
};

export const getActiveDocumentCount =
    (): number => {
        return documents.size;
    };