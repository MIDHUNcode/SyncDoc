import { useEffect, useState } from "react";
import * as Y from "yjs";

import type {
    DocumentData,
    ASTNode,
} from "../../types/document";

import ASTRenderer from "../blocks/ASTRenderer";
import { useYjsDocument } from "../../hooks/useYjsDocument";

interface DocumentViewerProps {
    document: DocumentData;
    onChange: (document: DocumentData) => void;
}

function DocumentViewer({
    document,
    onChange,
}: DocumentViewerProps) {
    /*
     * Keep the same user ID for this
     * browser session.
     */
    const [userId] = useState(() => {
        const existing =
            sessionStorage.getItem(
                "syncdoc-user-id",
            );

        if (existing) {
            return existing;
        }

        const id =
            crypto.randomUUID();

        sessionStorage.setItem(
            "syncdoc-user-id",
            id,
        );

        return id;
    });

    /*
     * User name.
     *
     * Stored in sessionStorage so the
     * same tab keeps the same name.
     */
    const [userName, setUserName] =
        useState(() => {
            const existing =
                sessionStorage.getItem(
                    "syncdoc-user-name",
                );

            return existing || "Anonymous";
        });

    /*
     * Change the current user's name.
     */
    const changeUserName = () => {
        const newName =
            window.prompt(
                "Enter your name",
                userName,
            );

        if (newName === null) {
            return;
        }

        const trimmedName =
            newName.trim();

        if (!trimmedName) {
            return;
        }

        sessionStorage.setItem(
            "syncdoc-user-name",
            trimmedName,
        );

        setUserName(trimmedName);
    };

    const {
        doc: yDoc,
        nodes: yNodes,
        astNodes,
        presenceUsers,
        editingUsers,
        connected: yjsConnected,
    } = useYjsDocument(
        document._id,
        userId,
        userName,
    );

    /*
     * Connection status.
     *
     * We currently have two states:
     *
     * connected
     * reconnecting
     *
     * We are not changing yjsClient.ts,
     * so false means the client is
     * disconnected/reconnecting.
     */
    const [
        connectionStatus,
        setConnectionStatus,
    ] = useState<
        "connected" | "reconnecting"
    >("reconnecting");

    /*
     * Update connection status whenever
     * the Yjs connection changes.
     */
    useEffect(() => {
        if (yjsConnected) {
            setConnectionStatus(
                "connected",
            );
        } else {
            setConnectionStatus(
                "reconnecting",
            );
        }
    }, [
        yjsConnected,
    ]);

    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(
            document.nodes,
        );

    /*
     * Reset local state when switching
     * documents.
     */
    useEffect(() => {
        setLocalNodes(
            document.nodes,
        );
    }, [
        document._id,
    ]);

    /*
     * Use Yjs state when connected.
     */
    useEffect(() => {
        if (!yjsConnected) {
            return;
        }

        setLocalNodes(astNodes);
    }, [
        astNodes,
        yjsConnected,
    ]);

    const updateNodeContent = (
        id: string,
        content: string,
    ) => {
        /*
         * Update React immediately.
         */
        setLocalNodes(
            (currentNodes) => {
                const updateNodes = (
                    nodes: ASTNode[],
                ): ASTNode[] => {
                    return nodes.map(
                        (node) => {
                            if (
                                node.id === id
                            ) {
                                return {
                                    ...node,
                                    content,
                                };
                            }

                            if (
                                node.children
                            ) {
                                return {
                                    ...node,
                                    children:
                                        updateNodes(
                                            node.children,
                                        ),
                                };
                            }

                            return node;
                        },
                    );
                };

                return updateNodes(
                    currentNodes,
                );
            },
        );

        /*
         * Update Yjs.
         */
        if (
            yDoc &&
            yNodes
        ) {
            yDoc.transact(() => {
                const updateNode = (
                    nodes: Y.Array<
                        Y.Map<unknown>
                    >,
                ): boolean => {
                    for (
                        let i = 0;
                        i < nodes.length;
                        i++
                    ) {
                        const yNode =
                            nodes.get(i);

                        if (
                            yNode.get(
                                "id",
                            ) === id
                        ) {
                            yNode.set(
                                "content",
                                content,
                            );

                            return true;
                        }

                        const children =
                            yNode.get(
                                "children",
                            );

                        if (
                            children instanceof
                            Y.Array
                        ) {
                            if (
                                updateNode(
                                    children as Y.Array<
                                        Y.Map<unknown>
                                    >,
                                )
                            ) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                updateNode(
                    yNodes,
                );
            });
        } else {
            /*
             * REST fallback.
             */
            setLocalNodes(
                (currentNodes) => {
                    onChange({
                        ...document,
                        nodes:
                            currentNodes,
                    });

                    return currentNodes;
                },
            );
        }
    };

    /*
     * Generate initials for an avatar.
     *
     * Examples:
     *
     * Midhun      -> M
     * Arun        -> A
     * Midhun G    -> MG
     * Arun Kumar  -> AK
     */
    const getInitials = (
        name: string,
    ): string => {
        const trimmedName =
            name.trim();

        if (!trimmedName) {
            return "?";
        }

        const parts =
            trimmedName.split(
                /\s+/,
            );

        if (parts.length === 1) {
            return parts[0][0]
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[
            parts.length - 1
            ][0]
        ).toUpperCase();
    };

    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border:
                    "1px solid #444",
                borderRadius: "10px",
            }}
        >
            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    marginBottom:
                        "20px",
                }}
            >
                <h2>
                    {document.title}
                </h2>

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "16px",
                    }}
                >
                    {/* Yjs connection status */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "6px",
                            fontSize:
                                "14px",
                        }}
                    >
                        <span
                            style={{
                                width:
                                    "9px",
                                height:
                                    "9px",
                                borderRadius:
                                    "50%",
                                backgroundColor:
                                    connectionStatus ===
                                        "connected"
                                        ? "#4caf50"
                                        : "#ff9800",
                                display:
                                    "inline-block",
                            }}
                        />

                        <span>
                            {connectionStatus ===
                                "connected"
                                ? "Connected"
                                : "Reconnecting..."}
                        </span>
                    </div>

                    {/* Presence */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "8px",
                        }}
                    >
                        <span>
                            🟢
                        </span>

                        {/* User avatars */}
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                            }}
                        >
                            {presenceUsers.map(
                                (
                                    user,
                                    index,
                                ) => (
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            border: "2px solid white",
                                            backgroundColor: "#555",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            marginLeft:
                                                index === 0
                                                    ? "0"
                                                    : "-8px",
                                            cursor: "default",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {getInitials(
                                            user.userName,
                                        )}

                                        {editingUsers.some(
                                            (editor) =>
                                                editor.userId ===
                                                user.userId,
                                        ) && (
                                                <span
                                                    title={`${user.userName} is editing`}
                                                    style={{
                                                        position: "absolute",
                                                        right: "-4px",
                                                        bottom: "-4px",
                                                        width: "16px",
                                                        height: "16px",
                                                        borderRadius: "50%",
                                                        background: "#222",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "9px",
                                                        border: "1px solid white",
                                                    }}
                                                >
                                                    ✏️
                                                </span>
                                            )}
                                    </div>
                                ),
                            )}
                        </div>

                        {/* Online count */}
                        <span>
                            {
                                presenceUsers.length
                            }{" "}
                            online
                        </span>
                    </div>

                    {/* Change name */}
                    <button
                        type="button"
                        onClick={
                            changeUserName
                        }
                        style={{
                            padding:
                                "6px 10px",
                            borderRadius:
                                "6px",
                            border:
                                "1px solid #555",
                            background:
                                "#1f1f23",
                            color:
                                "#fff",
                            cursor:
                                "pointer",
                        }}
                    >
                        Change name
                    </button>
                </div>
            </div>

            <ASTRenderer
                nodes={
                    localNodes
                }
                onChange={
                    updateNodeContent
                }
                yDoc={yDoc}
                userId={userId}
                userName={
                    userName
                }
            />
        </div>
    );
}

export default DocumentViewer;