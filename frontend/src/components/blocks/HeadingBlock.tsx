import type { ASTNode } from "../../types/document";
import EditableBlock from "./EditableBlock";

interface HeadingBlockProps {
    node: ASTNode;
    onChange?: (id: string, content: string) => void;
}

function HeadingBlock({
    node,
    onChange,
}: HeadingBlockProps) {
    return (
        <EditableBlock
            value={node.content ?? ""}
            onChange={(value) => {
                onChange?.(node.id, value);
            }}
        />
    );
}

export default HeadingBlock;