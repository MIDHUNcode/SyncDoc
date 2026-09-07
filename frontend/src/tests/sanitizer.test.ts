import type { ASTNode } from "../types/document";

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    sanitizeContent,
    sanitizeASTForRendering,
} from "../services/security/sanitizer";

describe(
    "Content Sanitizer",
    () => {
        it(
            "removes script tags",
            () => {
                const dirty =
                    '<script>alert("XSS")</script>Hello';

                const clean =
                    sanitizeContent(dirty);

                expect(clean).not.toContain(
                    "<script>"
                );

                expect(clean).not.toContain(
                    "alert"
                );

                expect(clean).toContain(
                    "Hello"
                );
            }
        );

        it(
            "removes HTML tags",
            () => {
                const dirty =
                    "<b>Hello</b> <i>World</i>";

                const clean =
                    sanitizeContent(dirty);

                expect(clean).toBe(
                    "Hello World"
                );
            }
        );

        it(
            "removes malicious image attributes",
            () => {
                const dirty =
                    '<img src="x" onerror="alert(1)">Hello';

                const clean =
                    sanitizeContent(dirty);

                expect(clean).not.toContain(
                    "onerror"
                );

                expect(clean).not.toContain(
                    "<img"
                );

                expect(clean).toContain(
                    "Hello"
                );
            }
        );

        it(
            "removes SVG onload injection",
            () => {
                const dirty =
                    '<svg onload="alert(1)">Hello</svg>';

                const clean =
                    sanitizeContent(dirty);

                expect(clean).toBe("");

                expect(clean).not.toContain(
                    "onload"
                );

                expect(clean).not.toContain(
                    "<svg"
                );

                expect(clean).not.toContain(
                    "alert"
                );
            }
        );

        it(
            "removes iframe injection",
            () => {
                const dirty =
                    '<iframe src="javascript:alert(1)"></iframe>Hello';

                const clean =
                    sanitizeContent(dirty);

                expect(clean).not.toContain(
                    "<iframe"
                );

                expect(clean).not.toContain(
                    "javascript:"
                );

                expect(clean).toContain(
                    "Hello"
                );
            }
        );

        it(
            "removes javascript links",
            () => {
                const dirty =
                    '<a href="javascript:alert(1)">Click me</a>';

                const clean =
                    sanitizeContent(dirty);

                expect(clean).not.toContain(
                    "javascript:"
                );

                expect(clean).not.toContain(
                    "<a"
                );

                expect(clean).toContain(
                    "Click me"
                );
            }
        );

        it(
            "preserves normal text",
            () => {
                const content =
                    "Hello SyncDoc";

                expect(
                    sanitizeContent(content)
                ).toBe(content);
            }
        );

        it(
            "preserves special characters in normal text",
            () => {
                const content =
                    'Hello "SyncDoc" & welcome to <users>';

                const clean =
                    sanitizeContent(content);

                expect(clean).toContain(
                    "Hello"
                );

                expect(clean).toContain(
                    "SyncDoc"
                );

                expect(clean).toContain(
                    "welcome"
                );
            }
        );

        it(
            "handles empty content",
            () => {
                expect(
                    sanitizeContent("")
                ).toBe("");
            }
        );

        it(
            "sanitizes nested AST content before rendering",
            () => {
                const nodes: ASTNode[] = [
                    {
                        id: "root",
                        type: "list",
                        children: [
                            {
                                id: "item-1",
                                type: "listItem",
                                content:
                                    '<script>alert("XSS")</script>Hello',
                                children: [
                                    {
                                        id: "nested",
                                        type: "paragraph",
                                        content:
                                            '<img src="x" onerror="alert(1)">Nested',
                                    },
                                ],
                            },
                        ],
                    },
                ];

                const clean =
                    sanitizeASTForRendering(
                        nodes,
                    );

                expect(
                    clean[0].children?.[0]
                        .content,
                ).toBe("Hello");

                expect(
                    clean[0].children?.[0]
                        .children?.[0]
                        .content,
                ).toBe("Nested");
            }
        );
    }
);