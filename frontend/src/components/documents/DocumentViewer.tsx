import { useEffect, useState } from "react";

import type { DocumentData, ASTNode } from "../../types/document";

import ASTRenderer from "../blocks/ASTRenderer";

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
            <h2>{document.title}</h2>

            <ASTRenderer
                nodes={localNodes}
                onChange={updateNodeContent}
            />
        </div>
    );
}

export default DocumentViewer;