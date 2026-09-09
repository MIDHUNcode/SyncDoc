import type { ASTNode } from "../../types/document";
import * as Y from "yjs";

import EditableBlock from "./EditableBlock";

interface ParagraphBlockProps {
    node: ASTNode;
    onChange?: (
        id: string,
        content: string,
    ) => void;
    yDoc: Y.Doc | null;
    userId: string;
    userName: string;

    onEditingChange?: (
        isEditing: boolean,
    ) => void;

    onLockChange?: (
        isLocked: boolean,
    ) => void;
}

function ParagraphBlock({
    node,
    onChange,
    yDoc,
    userId,
    userName,
    onEditingChange,
    onLockChange,
}: ParagraphBlockProps) {
    return (
        <EditableBlock
            nodeId={node.id}
            value={node.content ?? ""}
            onChange={(value) => {
                onChange?.(node.id, value);
            }}
            yDoc={yDoc}
            userId={userId}
            userName={userName}
            onEditingChange={
                onEditingChange
            }
            onLockChange={
                onLockChange
            }
        />
    );
}

export default ParagraphBlock;