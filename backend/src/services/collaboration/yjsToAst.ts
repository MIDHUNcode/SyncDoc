import * as Y from "yjs";

import type {
    ASTNode,
} from "../../types/ast.js";

export function yMapToASTNode(
    yNode: Y.Map<unknown>,
): ASTNode {
    const node: ASTNode = {
        id:
            yNode.get("id") as string,

        type:
            yNode.get(
                "type",
            ) as ASTNode["type"],

        content:
            (yNode.get(
                "content",
            ) as string) ?? "",
    };

    const yChildren =
        yNode.get("children");

    if (
        yChildren instanceof Y.Array
    ) {
        node.children =
            yChildren
                .toArray()
                .map(
                    (child) =>
                        yMapToASTNode(
                            child as Y.Map<unknown>,
                        ),
                );
    }

    return node;
}

export function yArrayToAST(
    yNodes: Y.Array<
        Y.Map<unknown>
    >,
): ASTNode[] {
    return yNodes
        .toArray()
        .map(
            (yNode) =>
                yMapToASTNode(
                    yNode,
                ),
        );
}
