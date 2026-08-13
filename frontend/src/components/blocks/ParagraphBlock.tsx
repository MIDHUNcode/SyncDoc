import type { ASTNode } from "../../types/document";
import EditableBlock from "./EditableBlock";

interface ParagraphBlockProps {
    node: ASTNode;
    onChange?: (id: string, content: string) => void;
}

function ParagraphBlock({
    node,
    onChange,
}: ParagraphBlockProps) {
    return (
        <EditableBlock
            value={node.content ?? ""}
            onChange={(value) => {
                onChange?.(node.id, value);
            }}
        />
    );
}

export default ParagraphBlock;