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

import {
    addPresenceUser,
    removePresenceUser,
    updatePresenceUser,
} from "../services/collaboration/presence";

interface PresenceUser {
    userId: string;
    userName: string;
    lastSeen: number;
}

interface UseYjsDocumentResult {
    doc: Y.Doc | null;
    nodes: Y.Array<Y.Map<unknown>> | null;
    astNodes: ASTNode[];
    presenceUsers: PresenceUser[];
    connected: boolean;
}

export function useYjsDocument(
    documentId: string | null,
    userId: string,
    userName: string,
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
            createYjsClient(documentId, userId);

        const socket =
            yjsClient.socket;

        /*
         * Presence map belongs to THIS document.
         */
        const presence =
            yjsClient.doc.getMap<PresenceUser>(
                "presence",
            );

        /*
         * Update AST state.
         */
        const updateReactState = () => {
            const nodes =
                yArrayToAST(
                    yjsClient.nodes,
                );

            setAstNodes(nodes);
        };

        /*
         * Update presence state.
         */
        const updatePresenceState = () => {
            const users: PresenceUser[] = [];

            presence.forEach(
                (user) => {
                    if (!user) {
                        return;
                    }

                    users.push(user);
                },
            );

            setPresenceUsers(users);
        };

        /*
         * WebSocket opened.
         */
        const handleOpen = () => {
            setConnected(true);

            updateReactState();
            updatePresenceState();

            /*
             * Register this browser in
             * the CURRENT document.
             */
            addPresenceUser(
                yjsClient.doc,
                userId,
                userName,
            );
        };

        /*
         * WebSocket closed.
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
         * Observe AST changes.
         */
        yjsClient.nodes.observeDeep(
            updateReactState,
        );

        /*
         * Observe presence changes.
         */
        presence.observe(
            updatePresenceState,
        );

        /*
         * Heartbeat.
         */
        const heartbeat =
            window.setInterval(() => {
                if (
                    yjsClient.socket.readyState ===
                    WebSocket.OPEN
                ) {
                    updatePresenceUser(
                        yjsClient.doc,
                        userId,
                        userName,
                    );
                }
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

        /*
         * If socket is already open.
         */
        if (
            socket.readyState ===
            WebSocket.OPEN
        ) {
            handleOpen();
        }

        setClient(yjsClient);

        /*
         * IMPORTANT:
         *
         * Presence cleanup happens BEFORE
         * yjsClient.destroy().
         */
        return () => {
            window.clearInterval(
                heartbeat,
            );

            /*
             * Remove this user from THIS
             * document while the socket is
             * still alive.
             */
            if (
                yjsClient.socket.readyState ===
                WebSocket.OPEN
            ) {
                removePresenceUser(
                    yjsClient.doc,
                    userId,
                );
            }

            /*
             * Remove listeners.
             */
            yjsClient.nodes.unobserveDeep(
                updateReactState,
            );

            presence.unobserve(
                updatePresenceState,
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

            /*
             * NOW destroy Yjs.
             */
            yjsClient.destroy();

            setClient(null);
            setConnected(false);
            setAstNodes([]);
            setPresenceUsers([]);
        };
    }, [
        documentId,
        userId,
        userName,
    ]);

    return {
        doc: client?.doc ?? null,
        nodes: client?.nodes ?? null,
        astNodes,
        presenceUsers,
        connected,
    };
}