import DOMPurify from "dompurify";
import type { ASTNode } from "../../types/document";

/*
 * SyncDoc security configuration.
 *
 * The current AST editor renders block content
 * primarily as text, so HTML is not required.
 *
 * Therefore, the safest configuration is to
 * remove all HTML tags and attributes.
 */

const SANITIZE_CONFIG = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
};

/**
 * Sanitize user-controlled content before
 * it is stored or rendered.
 */
export const sanitizeContent = (
    content: string
): string => {
    if (typeof content !== "string") {
        return "";
    }

    return DOMPurify.sanitize(
        content,
        SANITIZE_CONFIG
    );
};

/**
 * Sanitize an optional content value.
 */
export const sanitizeOptionalContent = (
    content?: string
): string | undefined => {
    if (content === undefined) {
        return undefined;
    }

    return sanitizeContent(content);
};

export const sanitizeASTForRendering = (
    nodes: ASTNode[],
): ASTNode[] => {
    return nodes.map((node) => ({
        ...node,
        content:
            node.content !== undefined
                ? sanitizeContent(node.content)
                : undefined,
        children:
            node.children?.length
                ? sanitizeASTForRendering(
                      node.children,
                  )
                : node.children,
    }));
};