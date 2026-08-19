import type { ASTNode } from "../../types/document";
import * as Y from "yjs";

import HeadingBlock from "./HeadingBlock";
import ParagraphBlock from "./ParagraphBlock";
import CodeBlock from "./CodeBlock";
import ListBlock from "./ListBlock";

interface ASTRendererProps {
    nodes: ASTNode[];
    onChange?: (
        id: string,
        content: string,
    ) => void;

    yDoc: Y.Doc | null;
    userId: string;
    userName: string;
}

function ASTRenderer({
    nodes,
    onChange,
    yDoc,
    userId,
    userName,
}: ASTRendererProps) {
    return (
        <div>
            {nodes.map((node) => {
                switch (node.type) {
                    case "heading":
                        return (
                            <HeadingBlock
                                key={node.id}
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );

                    case "paragraph":
                        return (
                            <ParagraphBlock
                                key={node.id}
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );

                    case "code":
                        return (
                            <CodeBlock
                                key={node.id}
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );

                    case "list":
                        return (
                            <ListBlock
                                key={node.id}
                                node={node}
                            />
                        );

                    default:
                        return (
                            <div key={node.id}>
                                Unsupported node type:{" "}
                                {node.type}
                            </div>
                        );
                }
            })}
        </div>
    );
}

export default ASTRenderer;