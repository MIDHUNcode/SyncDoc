import {
    WebSocketServer,
    WebSocket,
} from "ws";

import { Server } from "http";
import * as Y from "yjs";

import { getYDoc } from "./yjsDocumentManager";

const documentClients =
    new Map<string, Set<WebSocket>>();

interface ConnectedClient {
    documentId: string;
    userId: string | null;
}

const connectedClients =
    new Map<WebSocket, ConnectedClient>();

/*
 * One Yjs update handler per document.
 */
const documentUpdateHandlers =
    new Map<
        string,
        (
            update: Uint8Array,
            origin: unknown
        ) => void
    >();

export const initializeWebSocketServer = (
    server: Server
) => {
    const wss =
        new WebSocketServer({
            server,
            path: "/collab",
        });

    wss.on(
        "connection",
        async (
            socket: WebSocket,
            request
        ) => {
            const url = new URL(
                request.url || "",
                `http://${request.headers.host}`
            );

            const documentId =
                url.searchParams.get(
                    "documentId"
                );

            if (!documentId) {
                console.error(
                    "❌ Missing documentId"
                );

                socket.close(
                    1008,
                    "documentId is required"
                );

                return;
            }

            const yDoc =
                await getYDoc(documentId);

            /*
             * Store connection information.
             */
            connectedClients.set(
                socket,
                {
                    documentId,
                    userId: null,
                }
            );

            /*
             * Get or create clients for
             * this document.
             */
            let clients =
                documentClients.get(
                    documentId
                );

            if (!clients) {
                clients =
                    new Set<WebSocket>();

                documentClients.set(
                    documentId,
                    clients
                );
            }

            clients.add(socket);

            /*
             * Create ONE Yjs update handler
             * for this document.
             */
            if (
                !documentUpdateHandlers.has(
                    documentId
                )
            ) {
                const updateHandler = (
                    update: Uint8Array,
                    origin: unknown
                ) => {
                    const clientsForDocument =
                        documentClients.get(
                            documentId
                        );

                    if (
                        !clientsForDocument
                    ) {
                        return;
                    }

                    /*
                     * The origin is the socket
                     * that originally sent the
                     * update.
                     *
                     * Send the update to every
                     * OTHER connected client.
                     */
                    for (
                        const client
                        of clientsForDocument
                    ) {
                        if (
                            client !== origin &&
                            client.readyState ===
                            WebSocket.OPEN
                        ) {
                            client.send(update);
                        }
                    }
                };

                documentUpdateHandlers.set(
                    documentId,
                    updateHandler
                );

                yDoc.on(
                    "update",
                    updateHandler
                );
            }

            /*
             * Send current Yjs state to
             * newly connected client.
             */
            const initialState =
                Y.encodeStateAsUpdate(
                    yDoc
                );

            if (
                socket.readyState ===
                WebSocket.OPEN
            ) {
                socket.send(
                    initialState
                );
            }

            /*
             * Receive messages.
             */
            socket.on(
                "message",
                (message, isBinary) => {
                    try {
                        /*
                         * Text message.
                         */
                        if (!isBinary) {
                            const text =
                                message.toString(
                                    "utf8"
                                );

                            try {
                                const data =
                                    JSON.parse(
                                        text
                                    );

                                if (
                                    data.type ===
                                        "presence:init" &&
                                    typeof data.userId ===
                                        "string"
                                ) {
                                    const connection =
                                        connectedClients.get(
                                            socket
                                        );

                                    if (
                                        connection
                                    ) {
                                        connection.userId =
                                            data.userId;
                                    }

                                    return;
                                }
                            } catch {
                                console.error(
                                    "❌ Invalid WebSocket text message:",
                                    text
                                );
                            }

                            return;
                        }

                        /*
                         * Binary message =
                         * Yjs update.
                         */
                        let update: Uint8Array;

                        if (
                            Buffer.isBuffer(
                                message
                            )
                        ) {
                            update =
                                new Uint8Array(
                                    message.buffer,
                                    message.byteOffset,
                                    message.byteLength,
                                );
                        } else if (
                            message instanceof
                            ArrayBuffer
                        ) {
                            update =
                                new Uint8Array(
                                    message
                                );
                        } else if (
                            Array.isArray(
                                message
                            )
                        ) {
                            const combined =
                                Buffer.concat(
                                    message
                                );

                            update =
                                new Uint8Array(
                                    combined.buffer,
                                    combined.byteOffset,
                                    combined.byteLength,
                                );
                        } else {
                            throw new Error(
                                "❌ Unsupported WebSocket binary message type"
                            );
                        }

                        /*
                         * Apply the update with
                         * this socket as origin.
                         */
                        Y.applyUpdate(
                            yDoc,
                            update,
                            socket
                        );
                    } catch (error) {
                        console.error(
                            `❌ Failed to process WebSocket message for ${documentId}:`,
                            error
                        );
                    }
                }
            );

            /*
             * Handle disconnect.
             */
            socket.on(
                "close",
                () => {
                    const connection =
                        connectedClients.get(
                            socket
                        );

                    /*
                     * Remove this user's
                     * presence from Yjs.
                     */
                    if (
                        connection?.userId
                    ) {
                        const presence =
                            yDoc.getMap<{
                                userId: string;
                                userName: string;
                                timestamp: number;
                            }>(
                                "presence"
                            );

                        const userId =
                            connection.userId;

                        if (
                            presence.has(
                                userId
                            )
                        ) {
                            yDoc.transact(
                                () => {
                                    presence.delete(
                                        userId
                                    );
                                },
                                "presence:disconnect"
                            );
                        }
                    }

                    /*
                     * Remove socket from
                     * document clients.
                     */
                    clients?.delete(
                        socket
                    );

                    /*
                     * Remove connection info.
                     */
                    connectedClients.delete(
                        socket
                    );

                    /*
                     * If this was the last
                     * client, remove the
                     * document update handler.
                     */
                    if (
                        clients &&
                        clients.size === 0
                    ) {
                        documentClients.delete(
                            documentId
                        );

                        const updateHandler =
                            documentUpdateHandlers.get(
                                documentId
                            );

                        if (
                            updateHandler
                        ) {
                            yDoc.off(
                                "update",
                                updateHandler
                            );

                            documentUpdateHandlers.delete(
                                documentId
                            );
                        }
                    }
                }
            );

            /*
             * Handle errors.
             */
            socket.on(
                "error",
                (error) => {
                    console.error(
                        `❌ WebSocket error for ${documentId}:`,
                        error
                    );
                }
            );
        }
    );

    return wss;
};