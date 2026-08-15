import type {
    ASTNode,
    ASTNodeType,
} from "../types/document";

const VALID_NODE_TYPES: ASTNodeType[] = [
    "heading",
    "paragraph",
    "code",
    "list",
    "listItem",
];

interface ValidationResult {
    valid: boolean;
    errors: string[];
}

// ==========================================
// AST VALIDATOR
// ==========================================
export const validateAST = (
    nodes: ASTNode[]
): ValidationResult => {
    const errors: string[] = [];
    const nodeIds = new Set<string>();

    // ==========================================
    // VALIDATE NODE TREE
    // ==========================================
    const validateNodes = (
        currentNodes: ASTNode[],
        parent?: ASTNode
    ) => {
        currentNodes.forEach(
            (node, index) => {
                // ----------------------------------
                // NODE OBJECT
                // ----------------------------------
                if (
                    !node ||
                    typeof node !== "object"
                ) {
                    errors.push(
                        `Invalid node at position ${index}.`
                    );

                    return;
                }

                // ----------------------------------
                // NODE ID
                // ----------------------------------
                if (
                    !node.id ||
                    typeof node.id !== "string"
                ) {
                    errors.push(
                        `Node at position ${index} must have a valid id.`
                    );
                } else if (
                    nodeIds.has(node.id)
                ) {
                    errors.push(
                        `Duplicate node id: ${node.id}`
                    );
                } else {
                    nodeIds.add(node.id);
                }

                // ----------------------------------
                // NODE TYPE
                // ----------------------------------
                if (
                    !VALID_NODE_TYPES.includes(
                        node.type
                    )
                ) {
                    errors.push(
                        `Invalid node type "${String(
                            node.type
                        )}" for node ${
                            node.id || index
                        }.`
                    );
                }

                // ----------------------------------
                // CONTENT
                // ----------------------------------
                if (
                    node.content !== undefined &&
                    typeof node.content !== "string"
                ) {
                    errors.push(
                        `Content must be a string for node ${
                            node.id || index
                        }.`
                    );
                }

                // ----------------------------------
                // ATTRIBUTES
                // ----------------------------------
                if (
                    node.attributes !==
                        undefined &&
                    (
                        typeof node.attributes !==
                            "object" ||
                        node.attributes === null ||
                        Array.isArray(
                            node.attributes
                        )
                    )
                ) {
                    errors.push(
                        `Attributes must be an object for node ${
                            node.id || index
                        }.`
                    );
                }

                // ----------------------------------
                // CHILDREN
                // ----------------------------------
                if (
                    node.children !==
                        undefined
                ) {
                    if (
                        !Array.isArray(
                            node.children
                        )
                    ) {
                        errors.push(
                            `Children must be an array for node ${
                                node.id || index
                            }.`
                        );
                    } else {
                        validateChildren(
                            node,
                            validateNodes
                        );
                    }
                }

                // ----------------------------------
                // PARENT / CHILD VALIDATION
                // ----------------------------------
                if (
                    parent &&
                    !isValidChild(
                        parent.type,
                        node.type
                    )
                ) {
                    errors.push(
                        `Invalid child relationship: ${node.type} "${node.id}" cannot be a child of ${parent.type} "${parent.id}".`
                    );
                }
            }
        );
    };

    // ==========================================
    // VALIDATE CHILDREN
    // ==========================================
    const validateChildren = (
        parent: ASTNode,
        validateNodesFn: (
            nodes: ASTNode[],
            parent?: ASTNode
        ) => void
    ) => {
        if (!parent.children) return;

        validateNodesFn(
            parent.children,
            parent
        );
    };

    // ==========================================
    // VALID CHILD RELATIONSHIPS
    // ==========================================
    const isValidChild = (
        parentType: ASTNodeType,
        childType: ASTNodeType
    ): boolean => {
        // A list should contain listItem nodes.
        if (parentType === "list") {
            return childType === "listItem";
        }

        // A listItem can contain normal
        // content nodes or nested lists.
        if (parentType === "listItem") {
            return (
                childType === "paragraph" ||
                childType === "heading" ||
                childType === "code" ||
                childType === "list"
            );
        }

        // listItem should only exist inside a list.
        if (childType === "listItem") {
            return false;
        }

        // Other nodes do not currently impose
        // restrictions on children.
        return true;
    };

    // ==========================================
    // START VALIDATION
    // ==========================================
    validateNodes(nodes);

    return {
        valid: errors.length === 0,
        errors,
    };
};