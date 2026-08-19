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
     * Keep the same user ID for this browser session.
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
        connected: yjsConnected,
    } = useYjsDocument(
        document._id,
        userId,
    );

    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(document.nodes);

    /*
     * Reset local nodes when the selected document changes.
     */
    useEffect(() => {
        setLocalNodes(document.nodes);
    }, [document._id]);

    /*
     * Use Yjs state when connected.
     */
    useEffect(() => {
        if (!yjsConnected) {
            return;
        }

        setLocalNodes(astNodes);
    }, [astNodes, yjsConnected]);

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
                            children: updateNodes(
                                node.children,
                            ),
                        };
                    }

                    return node;
                });
            };

            return updateNodes(currentNodes);
        });

        /*
         * Update Yjs.
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

                        if (
                            yNode.get("id") === id
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

                updateNode(yNodes);
            });
        } else {
            /*
             * REST fallback.
             */
            setLocalNodes((currentNodes) => {
                onChange({
                    ...document,
                    nodes: currentNodes,
                });

                return currentNodes;
            });
        }
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
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                }}
            >
                <h2>{document.title}</h2>

                <span>
                    Yjs:{" "}
                    {yjsConnected
                        ? "Connected"
                        : "Disconnected"}
                </span>
            </div>

            <ASTRenderer
                nodes={localNodes}
                onChange={updateNodeContent}
                yDoc={yDoc}
                userId={userId}
                userName={userName}
            />
        </div>
    );
}

export default DocumentViewer;