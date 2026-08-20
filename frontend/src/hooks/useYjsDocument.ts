import { useEffect, useState } from "react";
import * as Y from "yjs";

import {
    createYjsClient,
    type YjsClient,
} from "../services/collaboration/yjsClient";

import { yArrayToAST } from "../services/collaboration/yjsToAst";

import {
    getPresence,
    type PresenceUser,
} from "../services/collaboration/presence";

import type { ASTNode } from "../types/document";

interface UseYjsDocumentResult {
    doc: Y.Doc | null;
    nodes: Y.Array<Y.Map<unknown>> | null;
    astNodes: ASTNode[];
    presenceUsers: PresenceUser[];
    connected: boolean;
}

const PRESENCE_TIMEOUT = 2000;

export function useYjsDocument(
    documentId: string | null,
): UseYjsDocumentResult {
    const [client, setClient] =
        useState<YjsClient | null>(null);

    const [connected, setConnected] =
        useState(false);

    const [astNodes, setAstNodes] =
        useState<ASTNode[]>([]);

    const [presenceUsers, setPresenceUsers] =
        useState<PresenceUser[]>([]);

    useEffect(() => {
        if (!documentId) {
            setClient(null);
            setConnected(false);
            setAstNodes([]);
            setPresenceUsers([]);

            return;
        }

        const yjsClient =
            createYjsClient(documentId);

        const socket =
            yjsClient.socket;

        const presence =
            getPresence(yjsClient.doc);

        /*
         * Update AST state from Yjs.
         */
        const updateReactState = () => {
            const nodes =
                yArrayToAST(
                    yjsClient.nodes,
                );

            setAstNodes(nodes);
        };

        /*
         * Update presence users.
         *
         * Users older than PRESENCE_TIMEOUT
         * are considered offline.
         */
        const updatePresenceState = () => {
            const now = Date.now();

            const users = Array.from(
                presence.values(),
            ).filter((user) => {
                return (
                    now - user.lastSeen <
                    PRESENCE_TIMEOUT
                );
            });

            setPresenceUsers(users);
        };

        const handleOpen = () => {
            setConnected(true);

            updateReactState();
            updatePresenceState();
        };

        const handleClose = () => {
            setConnected(false);
        };

        const handleError = (
            error: Event,
        ) => {
            console.error(
                "❌ Yjs WebSocket error:",
                error,
            );
        };

        /*
         * Listen for AST changes.
         */
        yjsClient.nodes.observeDeep(
            updateReactState,
        );

        /*
         * Listen for presence changes.
         */
        presence.observe(
            updatePresenceState,
        );

        /*
         * IMPORTANT:
         *
         * Presence can become stale even when
         * no Yjs update is received.
         *
         * Therefore check it every second.
         */
        const presenceTimer =
            window.setInterval(() => {
                updatePresenceState();
            }, 1000);

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

        return () => {
            yjsClient.nodes.unobserveDeep(
                updateReactState,
            );

            presence.unobserve(
                updatePresenceState,
            );

            window.clearInterval(
                presenceTimer,
            );

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

            yjsClient.destroy();

            setClient(null);
            setConnected(false);
            setAstNodes([]);
            setPresenceUsers([]);
        };
    }, [documentId]);

    return {
        doc: client?.doc ?? null,
        nodes: client?.nodes ?? null,
        astNodes,
        presenceUsers,
        connected,
    };
}