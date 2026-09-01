import {
    describe,
    expect,
    it,
} from "vitest";

import {
    sanitizeContent,
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
            "handles empty content",
            () => {
                expect(
                    sanitizeContent("")
                ).toBe("");
            }
        );
    }
);