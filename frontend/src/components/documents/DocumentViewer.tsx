import { useEffect, useState } from "react";
import * as Y from "yjs";

import type {
    DocumentData,
    ASTNode,
} from "../../types/document";

import ASTRenderer from "../blocks/ASTRenderer";
import { useYjsDocument } from "../../hooks/useYjsDocument";

import {
    addPresenceUser,
    removePresenceUser,
    updatePresenceUser,
} from "../../services/collaboration/presence";

interface DocumentViewerProps {
    document: DocumentData;
    onChange: (document: DocumentData) => void;
}

function DocumentViewer({
    document,
    onChange,
}: DocumentViewerProps) {
    /*
     * Keep the same user ID for this browser session.
     * Different browser sessions get different IDs.
     */
    const [userId] = useState(() => {
        const existing =
            sessionStorage.getItem(
                "syncdoc-user-id",
            );

        if (existing) {
            return existing;
        }

        const id = crypto.randomUUID();

        sessionStorage.setItem(
            "syncdoc-user-id",
            id,
        );

        return id;
    });

    const [userName] = useState("User");

    const {
        doc: yDoc,
        nodes: yNodes,
        astNodes,
        presenceUsers,
        connected: yjsConnected,
    } = useYjsDocument(document._id);

    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(document.nodes);

    /*
     * Register this user in Yjs presence.
     */
    useEffect(() => {
        if (!yDoc || !yjsConnected) {
            return;
        }

        addPresenceUser(
            yDoc,
            userId,
            userName,
        );

        /*
         * Send heartbeat every 5 seconds.
         */
        const heartbeat =
            window.setInterval(() => {
                updatePresenceUser(
                    yDoc,
                    userId,
                    userName,
                );
            }, 1000);

        /*
         * Remove user when leaving
         * the current document.
         */
        return () => {
            window.clearInterval(
                heartbeat,
            );

            removePresenceUser(
                yDoc,
                userId,
            );
        };
    }, [
        yDoc,
        yjsConnected,
        userId,
        userName,
    ]);

    /*
     * Reset local nodes when the
     * selected document changes.
     */
    useEffect(() => {
        setLocalNodes(
            document.nodes,
        );
    }, [document._id]);

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

    /*
     * Update a specific AST node.
     */
    const updateNodeContent = (
        id: string,
        content: string,
    ) => {
        /*
         * Update React immediately
         * so typing feels instant.
         */
        setLocalNodes((currentNodes) => {
            const updateNodes = (
                nodes: ASTNode[],
            ): ASTNode[] => {
                return nodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            content,
                        };
                    }

                    if (node.children) {
                        return {
                            ...node,
                            children:
                                updateNodes(
                                    node.children,
                                ),
                        };
                    }

                    return node;
                });
            };

            return updateNodes(
                currentNodes,
            );
        });

        /*
         * Update Yjs for collaboration.
         */
        if (yDoc && yNodes) {
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

                        /*
                         * Found the target node.
                         */
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

                        /*
                         * Search recursively
                         * through children.
                         */
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

                updateNode(yNodes);
            });

            return;
        }

        /*
         * REST fallback when Yjs
         * is not available.
         */
        setLocalNodes((currentNodes) => {
            onChange({
                ...document,
                nodes: currentNodes,
            });

            return currentNodes;
        });
    };

    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border: "1px solid #444",
                borderRadius: "10px",
            }}
        >
            {/* Document header */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                    }}
                >
                    {document.title}
                </h2>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "14px",
                    }}
                >
                    <span>
                        Yjs:{" "}
                        {yjsConnected
                            ? "🟢 Connected"
                            : "🔴 Disconnected"}
                    </span>

                    <span>
                        👥{" "}
                        {presenceUsers.length}{" "}
                        online
                    </span>
                </div>
            </div>

            {/* Presence UI */}
            {presenceUsers.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                        padding: "10px",
                        borderRadius: "8px",
                        background:
                            "#19191d",
                    }}
                >
                    <span
                        style={{
                            fontSize: "13px",
                            marginRight: "4px",
                        }}
                    >
                        Online:
                    </span>

                    {presenceUsers.map(
                        (user) => (
                            <div
                                key={
                                    user.userId
                                }
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "6px",
                                    padding:
                                        "6px 10px",
                                    borderRadius:
                                        "20px",
                                    background:
                                        "#25252b",
                                    fontSize:
                                        "13px",
                                }}
                            >
                                <span>
                                    🟢
                                </span>

                                <span>
                                    {
                                        user.userName
                                    }
                                </span>

                                {user.userId ===
                                    userId && (
                                    <span
                                        style={{
                                            opacity:
                                                0.6,
                                        }}
                                    >
                                        (You)
                                    </span>
                                )}
                            </div>
                        ),
                    )}
                </div>
            )}

            {/* AST document */}
            <ASTRenderer
                nodes={localNodes}
                onChange={
                    updateNodeContent
                }
                yDoc={yDoc}
                userId={userId}
                userName={userName}
            />
        </div>
    );
}

export default DocumentViewer;