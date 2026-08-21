import * as Y from "yjs";

export interface YjsClient {
    doc: Y.Doc;
    nodes: Y.Array<Y.Map<unknown>>;
    socket: WebSocket;
    destroy: () => void;
}

const WS_URL =
    import.meta.env.VITE_YJS_WS_URL ||
    "ws://localhost:5000";

const RECONNECT_DELAY = 1000;

export function createYjsClient(
    documentId: string,
    userId: string,
): YjsClient {
    const doc = new Y.Doc();

    const nodes =
        doc.getArray<
            Y.Map<unknown>
        >("nodes");

    let socket: WebSocket;

    let destroyed = false;

    let reconnectTimer:
        number | null = null;

    let reconnecting = false;

    /*
     * Create a WebSocket connection.
     */
    const connect = () => {
        if (destroyed) {
            return;
        }

        if (
            socket &&
            (
                socket.readyState ===
                    WebSocket.OPEN ||
                socket.readyState ===
                    WebSocket.CONNECTING
            )
        ) {
            return;
        }

        const socketUrl =
            `${WS_URL}/collab?documentId=${documentId}`;

        socket = new WebSocket(
            socketUrl,
        );

        socket.binaryType =
            "arraybuffer";

        /*
         * Connection opened.
         */
        socket.addEventListener(
            "open",
            () => {
                if (destroyed) {
                    return;
                }

                reconnecting = false;

                console.log(
                    "🟢 Yjs connected",
                );

                /*
                 * Tell server which user owns
                 * this WebSocket connection.
                 */
                socket.send(
                    JSON.stringify({
                        type:
                            "presence:init",
                        userId,
                    }),
                );
            },
        );

        /*
         * Connection closed.
         */
        socket.addEventListener(
            "close",
            () => {
                if (destroyed) {
                    return;
                }

                console.warn(
                    "🔴 Yjs disconnected",
                );

                scheduleReconnect();
            },
        );

        /*
         * Connection error.
         *
         * The close event will normally
         * follow and trigger reconnect.
         */
        socket.addEventListener(
            "error",
            (error) => {
                if (destroyed) {
                    return;
                }

                console.error(
                    "❌ Yjs WebSocket error:",
                    error,
                );
            },
        );

        /*
         * Incoming Yjs updates.
         */
        socket.addEventListener(
            "message",
            (event) => {
                if (destroyed) {
                    return;
                }

                try {
                    if (
                        event.data instanceof
                        ArrayBuffer
                    ) {
                        Y.applyUpdate(
                            doc,
                            new Uint8Array(
                                event.data,
                            ),
                            "remote",
                        );

                        return;
                    }

                    if (
                        event.data instanceof
                        Blob
                    ) {
                        event.data
                            .arrayBuffer()
                            .then(
                                (buffer) => {
                                    if (
                                        destroyed
                                    ) {
                                        return;
                                    }

                                    Y.applyUpdate(
                                        doc,
                                        new Uint8Array(
                                            buffer,
                                        ),
                                        "remote",
                                    );
                                },
                            );

                        return;
                    }

                    console.error(
                        "❌ Unexpected WebSocket message type",
                    );
                } catch (error) {
                    console.error(
                        "❌ Failed to apply Yjs update:",
                        error,
                    );
                }
            },
        );
    };

    /*
     * Schedule automatic reconnect.
     */
    const scheduleReconnect = () => {
        if (
            destroyed ||
            reconnecting
        ) {
            return;
        }

        reconnecting = true;

        console.log(
            `🔄 Reconnecting in ${RECONNECT_DELAY}ms...`,
        );

        reconnectTimer =
            window.setTimeout(() => {
                reconnectTimer = null;
                reconnecting = false;

                if (destroyed) {
                    return;
                }

                connect();
            }, RECONNECT_DELAY);
    };

    /*
     * Send local Yjs updates to the
     * server.
     */
    const updateHandler = (
        update: Uint8Array,
        origin: unknown,
    ) => {
        if (
            destroyed ||
            origin === "remote"
        ) {
            return;
        }

        if (
            !socket ||
            socket.readyState !==
                WebSocket.OPEN
        ) {
            return;
        }

        const buffer =
            update.buffer instanceof
            ArrayBuffer
                ? update.buffer.slice(
                      update.byteOffset,
                      update.byteOffset +
                          update.byteLength,
                  )
                : new Uint8Array(
                      update,
                  ).buffer;

        socket.send(buffer);
    };

    doc.on(
        "update",
        updateHandler,
    );

    /*
     * Initial connection.
     */
    connect();

    const destroy = () => {
        if (destroyed) {
            return;
        }

        destroyed = true;

        /*
         * Cancel pending reconnect.
         */
        if (
            reconnectTimer !== null
        ) {
            window.clearTimeout(
                reconnectTimer,
            );

            reconnectTimer = null;
        }

        /*
         * Stop sending Yjs updates.
         */
        doc.off(
            "update",
            updateHandler,
        );

        /*
         * Close WebSocket.
         */
        if (
            socket &&
            (
                socket.readyState ===
                    WebSocket.OPEN ||
                socket.readyState ===
                    WebSocket.CONNECTING
            )
        ) {
            socket.close();
        }

        /*
         * Destroy Yjs document.
         */
        doc.destroy();
    };

    return {
        doc,
        nodes,
        get socket() {
            return socket;
        },
        destroy,
    };
}