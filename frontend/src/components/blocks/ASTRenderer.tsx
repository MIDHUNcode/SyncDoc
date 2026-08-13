import type { ASTNode } from "../../types/document";

import HeadingBlock from "./HeadingBlock";
import ParagraphBlock from "./ParagraphBlock";
import CodeBlock from "./CodeBlock";
import ListBlock from "./ListBlock";

interface ASTRendererProps {
    nodes: ASTNode[];
    onChange?: (id: string, content: string) => void;
}

function ASTRenderer({
    nodes,
    onChange,
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
                            />
                        );

                    case "paragraph":
                        return (
                            <ParagraphBlock
                                key={node.id}
                                node={node}
                                onChange={onChange}
                            />
                        );

                    case "code":
                        return (
                            <CodeBlock
                                key={node.id}
                                node={node}
                                onChange={onChange}
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
                                Unsupported node type: {node.type}
                            </div>
                        );
                }
            })}
        </div>
    );
}

export default ASTRenderer;