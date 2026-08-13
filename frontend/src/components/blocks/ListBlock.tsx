import type { ASTNode } from "../../types/document";
import ASTRenderer from "./ASTRenderer";

interface ListBlockProps {
  node: ASTNode;
}

const ListBlock = ({ node }: ListBlockProps) => {
  return (
    <ul>
      {node.children?.map((child) => (
        <li key={child.id}>
          {child.content}

          {child.children && child.children.length > 0 && (
            <ASTRenderer nodes={child.children} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListBlock;