import { useEffect, useState } from "react";

import type { DocumentData, ASTNode } from "../../types/document";

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
    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(document.nodes);

    const {
        connected: yjsConnected,
    } = useYjsDocument(document._id);

    useEffect(() => {
        setLocalNodes(document.nodes);
    }, [document.nodes]);

    const updateNodeContent = (
        id: string,
        content: string
    ) => {
        setLocalNodes((currentNodes) => {
            const updatedNodes = currentNodes.map(
                (node) =>
                    node.id === id
                        ? {
                              ...node,
                              content,
                          }
                        : node
            );

            onChange({
                ...document,
                nodes: updatedNodes,
            });

            return updatedNodes;
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
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
            />
        </div>
    );
}

export default DocumentViewer;