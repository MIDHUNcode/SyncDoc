import * as Y from "yjs";

export interface YjsClient {
    doc: Y.Doc;
    nodes: Y.Array<Y.Map<unknown>>;
    readonly socket: WebSocket;

    onStatusChange: (
        callback: (connected: boolean) => void,
    ) => () => void;

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
        doc.getArray<Y.Map<unknown>>("nodes");

    let socket: WebSocket;

    let destroyed = false;

    let reconnectTimer:
        number | null = null;

    let reconnecting = false;

    const statusListeners =
        new Set<(connected: boolean) => void>();

    const notifyStatus = (
        connected: boolean,
    ) => {
        statusListeners.forEach(
            (callback) => {
                callback(connected);
            },
        );
    };

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

        console.log(
            "🔌 Connecting Yjs:",
            socketUrl,
        );

        socket = new WebSocket(
            socketUrl,
        );

        socket.binaryType =
            "arraybuffer";

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

                socket.send(
                    JSON.stringify({
                        type:
                            "presence:init",
                        userId,
                    }),
                );

                notifyStatus(true);
            },
        );

        socket.addEventListener(
            "close",
            () => {
                if (destroyed) {
                    return;
                }

                console.warn(
                    "🔴 Yjs disconnected",
                );

                notifyStatus(false);

                scheduleReconnect();
            },
        );

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

        socket.addEventListener(
            "message",
            async (event) => {
                if (destroyed) {
                    return;
                }

                try {
                    let update:
                        Uint8Array | null =
                        null;

                    if (
                        event.data instanceof
                        ArrayBuffer
                    ) {
                        update =
                            new Uint8Array(
                                event.data,
                            );
                    }

                    else if (
                        event.data instanceof
                        Blob
                    ) {
                        const buffer =
                            await event.data
                                .arrayBuffer();

                        update =
                            new Uint8Array(
                                buffer,
                            );
                    }

                    if (!update) {
                        console.warn(
                            "⚠️ Unexpected WebSocket message",
                            event.data,
                        );

                        return;
                    }

                    /*
                     * IMPORTANT:
                     *
                     * Yjs itself handles duplicate
                     * updates safely.
                     *
                     * The server must therefore
                     * send the same Yjs document
                     * state, not recreate AST nodes
                     * with new Yjs IDs.
                     */
                    Y.applyUpdate(
                        doc,
                        update,
                        "remote",
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

    connect();

    const destroy = () => {
        if (destroyed) {
            return;
        }

        destroyed = true;

        if (
            reconnectTimer !== null
        ) {
            window.clearTimeout(
                reconnectTimer,
            );

            reconnectTimer = null;
        }

        doc.off(
            "update",
            updateHandler,
        );

        statusListeners.clear();

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

        doc.destroy();
    };

    return {
        doc,
        nodes,

        get socket() {
            return socket;
        },

        onStatusChange(callback) {
            statusListeners.add(
                callback,
            );

            return () => {
                statusListeners.delete(
                    callback,
                );
            };
        },

        destroy,
    };
}