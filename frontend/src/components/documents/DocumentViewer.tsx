import { useEffect, useState } from "react";

import type { ASTNode } from "../../types/document";

import ASTRenderer from "../blocks/ASTRenderer";

interface DocumentViewerProps {
    title: string;
    nodes: ASTNode[];
}

function DocumentViewer({
    title,
    nodes,
}: DocumentViewerProps) {
    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(nodes);

    useEffect(() => {
        setLocalNodes(nodes);
    }, [nodes]);

    const updateNodeContent = (
        id: string,
        content: string
    ) => {
        setLocalNodes((currentNodes) =>
            currentNodes.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          content,
                      }
                    : node
            )
        );
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
            <h2>{title}</h2>

            <ASTRenderer
                nodes={localNodes}
                onChange={updateNodeContent}
            />
        </div>
    );
}

export default DocumentViewer;