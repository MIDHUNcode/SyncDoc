import * as Y from "yjs";

import type { ASTNode } from "../../types/ast.js";

import { astNodeToYMap } from "./astToYjs.js";

import {
    yArrayToAST,
} from "./yjsToAst.js";

import DocumentModel from "../../models/Document.js";

const documents =
    new Map<string, Y.Doc>();

export const getYDoc = async (
    documentId: string
): Promise<Y.Doc> => {
    let yDoc =
        documents.get(documentId);

    if (yDoc) {
        return yDoc;
    }

    yDoc = new Y.Doc();

    documents.set(
        documentId,
        yDoc,
    );

    /*
     * Load the existing AST from MongoDB
     * when this Y.Doc is created for the
     * first time.
     */
    const document =
        await DocumentModel
            .findById(documentId)
            .lean();

    if (!document) {
        console.error(
            `❌ Document not found: ${documentId}`,
        );

        return yDoc;
    }

    initializeYDocFromAST(
        yDoc,
        document.nodes,
    );

    return yDoc;
};

export const initializeYDocFromAST = (
    yDoc: Y.Doc,
    nodes: ASTNode[],
): void => {
    const yNodes =
        yDoc.getArray<
            Y.Map<unknown>
        >("nodes");

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

/*
 * Persist the current Yjs AST to MongoDB.
 *
 * Yjs is the source of truth while a document
 * is actively being collaboratively edited.
 *
 * MongoDB stores the latest persisted AST so
 * REST requests and PDF export can use the
 * latest collaborative state.
 */
export const persistYDocToMongoDB =
    async (
        documentId: string,
        yDoc: Y.Doc,
    ): Promise<void> => {
        const yNodes =
            yDoc.getArray<
                Y.Map<unknown>
            >("nodes");

        const nodes =
            yArrayToAST(
                yNodes,
            );

        await DocumentModel.findByIdAndUpdate(
            documentId,
            {
                $set: {
                    nodes,
                },
            },
            {
                new: true,
            },
        );

        console.log(
            `💾 Yjs document persisted to MongoDB: ${documentId}`,
        );
    };

export const hasYDoc = (
    documentId: string,
): boolean => {
    return documents.has(
        documentId,
    );
};

export const deleteYDoc = (
    documentId: string,
): void => {
    const yDoc =
        documents.get(
            documentId,
        );

    if (!yDoc) {
        return;
    }

    yDoc.destroy();

    documents.delete(
        documentId,
    );
};

export const getActiveDocumentCount =
    (): number => {
        return documents.size;
    };

