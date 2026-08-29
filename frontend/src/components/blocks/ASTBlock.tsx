import type { ReactNode } from "react";

import type { ASTNode } from "../../types/document";
import type { AtomicBlockState } from "../../types/blockState";

interface ASTBlockProps {
  node: ASTNode;
  state: AtomicBlockState;
  children: ReactNode;
}

export default function ASTBlock({
  node,
  state,
  children,
}: ASTBlockProps) {
  return (
    <div
      data-block-id={node.id}
      data-block-type={node.type}
      data-active={state.isActive}
      data-editing={state.isEditing}
      data-locked={state.isLocked}
      className="syncdoc-ast-block"
    >
      {children}
    </div>
  );
}