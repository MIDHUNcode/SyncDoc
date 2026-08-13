import type { ASTNode } from "../../types/document";
import EditableBlock from "./EditableBlock";

interface CodeBlockProps {
    node: ASTNode;
    onChange?: (id: string, content: string) => void;
}

function CodeBlock({
    node,
    onChange,
}: CodeBlockProps) {
    return (
        <EditableBlock
            value={node.content ?? ""}
            onChange={(value) => {
                onChange?.(node.id, value);
            }}
        />
    );
}

export default CodeBlock;