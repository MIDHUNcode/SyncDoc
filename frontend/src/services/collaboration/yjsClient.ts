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

export function createYjsClient(
    documentId: string,
): YjsClient {
    const doc = new Y.Doc();

    const nodes =
        doc.getArray<Y.Map<unknown>>("nodes");

    const socketUrl =
        `${WS_URL}/collab?documentId=${documentId}`;

    const socket =
        new WebSocket(socketUrl);

    let destroyed = false;

    socket.binaryType = "arraybuffer";

    socket.onmessage = (event) => {
        if (destroyed) {
            return;
        }

        try {
            if (event.data instanceof ArrayBuffer) {
                const update =
                    new Uint8Array(event.data);

                Y.applyUpdate(
                    doc,
                    update,
                    "remote",
                );

                return;
            }

            if (event.data instanceof Blob) {
                event.data
                    .arrayBuffer()
                    .then((buffer) => {
                        if (destroyed) {
                            return;
                        }

                        Y.applyUpdate(
                            doc,
                            new Uint8Array(buffer),
                            "remote",
                        );
                    });

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
            socket.readyState ===
            WebSocket.OPEN
        ) {
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
        }
    };

    doc.on("update", updateHandler);

    const destroy = () => {
        destroyed = true;

        doc.off(
            "update",
            updateHandler,
        );

        if (
            socket.readyState ===
            WebSocket.OPEN
        ) {
            socket.close();
        }

        doc.destroy();
    };

    return {
        doc,
        nodes,
        socket,
        destroy,
    };
}