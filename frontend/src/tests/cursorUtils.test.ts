import {
  describe,
  expect,
  it,
  beforeEach,
} from "vitest";

import {
  getCursorOffset,
} from "../state/cursorUtils";

describe("Cursor Utilities", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = "";

    element =
      document.createElement("div");

    element.textContent =
      "Hello SyncDoc";

    document.body.appendChild(
      element,
    );
  });

  it("returns the cursor offset", () => {
    const textNode =
      element.firstChild;

    if (!textNode) {
      throw new Error(
        "Text node not found",
      );
    }

    const range =
      document.createRange();

    range.setStart(
      textNode,
      5,
    );

    range.collapse(true);

    const selection =
      window.getSelection();

    if (!selection) {
      throw new Error(
        "Selection not available",
      );
    }

    selection.removeAllRanges();

    selection.addRange(range);

    expect(
      getCursorOffset(element),
    ).toBe(5);
  });

  it("returns zero when there is no selection", () => {
    const selection =
      window.getSelection();

    selection?.removeAllRanges();

    expect(
      getCursorOffset(element),
    ).toBe(0);
  });

  it("returns zero when the selection is outside the element", () => {
    const outside =
      document.createElement("div");

    outside.textContent =
      "Outside";

    document.body.appendChild(
      outside,
    );

    const textNode =
      outside.firstChild;

    if (!textNode) {
      throw new Error(
        "Text node not found",
      );
    }

    const range =
      document.createRange();

    range.setStart(
      textNode,
      3,
    );

    range.collapse(true);

    const selection =
      window.getSelection();

    if (!selection) {
      throw new Error(
        "Selection not available",
      );
    }

    selection.removeAllRanges();

    selection.addRange(range);

    expect(
      getCursorOffset(element),
    ).toBe(0);
  });

  it("returns the end offset", () => {
    const textNode =
      element.firstChild;

    if (!textNode) {
      throw new Error(
        "Text node not found",
      );
    }

    const range =
      document.createRange();

    range.setStart(
      textNode,
      textNode.textContent?.length ?? 0,
    );

    range.collapse(true);

    const selection =
      window.getSelection();

    if (!selection) {
      throw new Error(
        "Selection not available",
      );
    }

    selection.removeAllRanges();

    selection.addRange(range);

    expect(
      getCursorOffset(element),
    ).toBe(13);
  });
});