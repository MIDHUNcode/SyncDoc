import { useEffect, useState } from "react";
import * as Y from "yjs";

import {
    createYjsClient,
    type YjsClient,
} from "../services/collaboration/yjsClient";

interface UseYjsDocumentResult {
    doc: Y.Doc | null;
    nodes: Y.Array<Y.Map<unknown>> | null;
    connected: boolean;
}

export function useYjsDocument(
    documentId: string | null,
): UseYjsDocumentResult {
    const [client, setClient] =
        useState<YjsClient | null>(null);

    const [connected, setConnected] =
        useState(false);

    useEffect(() => {
        if (!documentId) {
            setClient(null);
            setConnected(false);
            return;
        }

        const yjsClient =
            createYjsClient(documentId);

        const socket =
            yjsClient.socket;

        const handleOpen = () => {
            console.log(
                `🟢 Yjs connected: ${documentId}`,
            );

            setConnected(true);
        };

        const handleClose = () => {
            console.log(
                `🔴 Yjs disconnected: ${documentId}`,
            );

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
        };
    }, [documentId]);

    return {
        doc: client?.doc ?? null,
        nodes: client?.nodes ?? null,
        connected,
    };
}