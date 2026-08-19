import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import * as Y from "yjs";
import { getYDoc } from "./yjsDocumentManager";

const documentClients = new Map<string, Set<WebSocket>>();

export const initializeWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({
        server,
        path: "/collab",
    });

    wss.on("connection", async (socket: WebSocket, request) => {

        const url = new URL(
            request.url || "",
            `http://${request.headers.host}`
        );

        const documentId = url.searchParams.get("documentId");

        if (!documentId) {
            console.log("❌ Missing documentId");

            socket.close(1008, "documentId is required");
            return;
        }

        const yDoc = await getYDoc(documentId);

        // Get or create clients for this document
        let clients = documentClients.get(documentId);

        if (!clients) {
            clients = new Set<WebSocket>();
            documentClients.set(documentId, clients);
        }

        clients.add(socket);

        /*
         * Send the current Yjs state to the newly connected client.
         */
        const initialState = Y.encodeStateAsUpdate(yDoc);

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(initialState);
        }

        /*
         * Listen for updates generated inside this Y.Doc.
         */
        const updateHandler = (
            update: Uint8Array,
            origin: unknown
        ) => {
            // Don't send the update back to the client that created it.
            if (origin === socket) {
                return;
            }

            const documentClientsList =
                documentClients.get(documentId);

            if (!documentClientsList) {
                return;
            }

            for (const client of documentClientsList) {
                if (
                    client !== socket &&
                    client.readyState === WebSocket.OPEN
                ) {
                    client.send(update);
                }
            }
        };

        yDoc.on("update", updateHandler);

        /*
         * Receive Yjs updates from the client.
         */
        socket.on("message", (message) => {
            try {
                const update = new Uint8Array(message as Buffer);

                Y.applyUpdate(yDoc, update, socket);

            } catch (error) {
                console.error(
                    `❌ Failed to apply Yjs update for ${documentId}:`,
                    error
                );
            }
        });

        /*
         * Handle client disconnect.
         */
        socket.on("close", () => {
            clients?.delete(socket);

            yDoc.off("update", updateHandler);

            if (clients && clients.size === 0) {
                documentClients.delete(documentId);
            }
        });

        /*
         * Handle WebSocket errors.
         */
        socket.on("error", (error) => {
            console.error(
                `❌ WebSocket error for ${documentId}:`,
                error
            );
        });
    });

    return wss;
};