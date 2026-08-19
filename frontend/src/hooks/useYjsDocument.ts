import { useEffect, useState } from "react";
import * as Y from "yjs";

import {
    createYjsClient,
    type YjsClient,
} from "../services/collaboration/yjsClient";

import {
    yArrayToAST,
} from "../services/collaboration/yjsToAst";

import type { ASTNode } from "../types/document";

interface UseYjsDocumentResult {
    doc: Y.Doc | null;
    nodes: Y.Array<Y.Map<unknown>> | null;
    astNodes: ASTNode[];
    connected: boolean;
}

interface BlockLock {
    userId: string;
    userName: string;
    timestamp: number;
}

export function useYjsDocument(
    documentId: string | null,
    userId: string,
): UseYjsDocumentResult {
    const [client, setClient] =
        useState<YjsClient | null>(null);

    const [connected, setConnected] =
        useState(false);

    const [astNodes, setAstNodes] =
        useState<ASTNode[]>([]);

    useEffect(() => {
        if (!documentId) {
            setClient(null);
            setConnected(false);
            setAstNodes([]);

            return;
        }

        const yjsClient =
            createYjsClient(documentId);

        const socket =
            yjsClient.socket;

        /*
         * Convert Yjs AST → React AST.
         */
        const updateReactState = () => {
            const nodes =
                yArrayToAST(
                    yjsClient.nodes,
                );

            setAstNodes(nodes);
        };

        /*
         * WebSocket connected.
         */
        const handleOpen = () => {
            setConnected(true);

            updateReactState();
        };

        /*
         * WebSocket disconnected.
         */
        const handleClose = () => {
            setConnected(false);
        };

        /*
         * WebSocket error.
         */
        const handleError = (
            error: Event,
        ) => {
            console.error(
                "❌ Yjs WebSocket error:",
                error,
            );
        };

        /*
         * Listen only to AST changes.
         */
        yjsClient.nodes.observeDeep(
            updateReactState,
        );

        socket.addEventListener(
            "open",
            handleOpen,
        );

        socket.addEventListener(
            "close",
            handleClose,
        );

        socket.addEventListener(
            "error",
            handleError,
        );

        setClient(yjsClient);

        /*
         * Cleanup when:
         *
         * - document changes
         * - DocumentViewer unmounts
         * - component is destroyed
         */
        return () => {
            /*
             * Remove only locks owned
             * by this browser/user.
             */
            const locks =
                yjsClient.doc.getMap<BlockLock>(
                    "blockLocks",
                );

            const ownedLocks: string[] = [];

            locks.forEach(
                (lock, nodeId) => {
                    if (
                        lock.userId ===
                        userId
                    ) {
                        ownedLocks.push(
                            nodeId,
                        );
                    }
                },
            );

            /*
             * Delete the user's locks.
             */
            yjsClient.doc.transact(() => {
                for (
                    const nodeId of ownedLocks
                ) {
                    locks.delete(nodeId);
                }
            });

            /*
             * Stop AST observation.
             */
            yjsClient.nodes.unobserveDeep(
                updateReactState,
            );

            /*
             * Remove WebSocket listeners.
             */
            socket.removeEventListener(
                "open",
                handleOpen,
            );

            socket.removeEventListener(
                "close",
                handleClose,
            );

            socket.removeEventListener(
                "error",
                handleError,
            );

            /*
             * Destroy Yjs client.
             */
            yjsClient.destroy();

            setClient(null);
            setConnected(false);
            setAstNodes([]);
        };
    }, [documentId, userId]);

    return {
        doc: client?.doc ?? null,
        nodes: client?.nodes ?? null,
        astNodes,
        connected,
    };
}