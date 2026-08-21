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

    const [userName] =
        useState("User");

    const {
        doc: yDoc,
        nodes: yNodes,
        astNodes,
        presenceUsers,
        connected: yjsConnected,
    } = useYjsDocument(
        document._id,
        userId,
        userName,
    );

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
                        gap: "12px",
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
                        {
                            presenceUsers.length
                        }{" "}
                        online
                    </span>
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