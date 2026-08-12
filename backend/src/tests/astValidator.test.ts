import { describe, expect, it } from "vitest";
import { validateAST } from "../services/astValidator.js";
import type { ASTNode } from "../types/ast.js";

describe("AST Validator", () => {
    // 1. Valid AST
    it("accepts a valid AST", () => {
        const nodes: ASTNode[] = [
            {
                id: "node-1",
                type: "heading",
                content: "SyncDoc",
            },
            {
                id: "node-2",
                type: "paragraph",
                content: "Collaborative document engine.",
            },
        ];

        expect(() => validateAST(nodes)).not.toThrow();
    });

    // 2. Missing node ID
    it("rejects a node without an ID", () => {
        const nodes = [
            {
                id: "",
                type: "paragraph",
                content: "Invalid node",
            },
        ];

        expect(() => validateAST(nodes as ASTNode[])).toThrow(
            "Missing or invalid node id"
        );
    });

    // 3. Invalid node type
    it("rejects an invalid node type", () => {
        const nodes = [
            {
                id: "node-1",
                type: "banana",
                content: "Invalid node",
            },
        ];

        expect(() => validateAST(nodes as ASTNode[])).toThrow(
            "Invalid node type"
        );
    });

    // 4. Missing content
    it("rejects content-required nodes without content", () => {
        const nodes = [
            {
                id: "node-1",
                type: "paragraph",
            },
        ];

        expect(() => validateAST(nodes as ASTNode[])).toThrow(
            "Missing content for paragraph"
        );
    });

    // 5. Duplicate node IDs
    it("rejects duplicate node IDs", () => {
        const nodes: ASTNode[] = [
            {
                id: "node-1",
                type: "heading",
                content: "First",
            },
            {
                id: "node-1",
                type: "paragraph",
                content: "Duplicate",
            },
        ];

        expect(() => validateAST(nodes)).toThrow(
            'Duplicate node id "node-1"'
        );
    });

    // 6. Invalid child relationship
    it("rejects invalid child relationships", () => {
        const nodes = [
            {
                id: "node-1",
                type: "paragraph",
                content: "Parent",
                children: [
                    {
                        id: "node-2",
                        type: "code",
                        content: "console.log('test');",
                    },
                ],
            },
        ];

        expect(() => validateAST(nodes as ASTNode[])).toThrow(
            "paragraph cannot contain code"
        );
    });

    // 7. Valid nested AST
    it("accepts a valid nested AST", () => {
        const nodes: ASTNode[] = [
            {
                id: "node-1",
                type: "list",
                children: [
                    {
                        id: "node-2",
                        type: "listItem",
                        content: "Frontend",
                        children: [
                            {
                                id: "node-3",
                                type: "paragraph",
                                content: "React",
                            },
                        ],
                    },
                ],
            },
        ];

        expect(() => validateAST(nodes)).not.toThrow();
    });

    // 8. Invalid deeply nested node
    it("rejects an invalid deeply nested node", () => {
        const nodes = [
            {
                id: "node-1",
                type: "list",
                children: [
                    {
                        id: "node-2",
                        type: "listItem",
                        content: "Frontend",
                        children: [
                            {
                                id: "node-3",
                                type: "banana",
                                content: "Invalid",
                            },
                        ],
                    },
                ],
            },
        ];

        expect(() => validateAST(nodes as ASTNode[])).toThrow(
            "listItem cannot contain banana"
        );
    });
});