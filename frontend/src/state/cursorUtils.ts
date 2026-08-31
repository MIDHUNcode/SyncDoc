export function getCursorOffset(
  element: HTMLElement,
): number {
  const selection =
    window.getSelection();

  if (
    !selection ||
    selection.rangeCount === 0
  ) {
    return 0;
  }

  const range =
    selection.getRangeAt(0);

  if (
    !element.contains(range.startContainer)
  ) {
    return 0;
  }

  const preRange =
    document.createRange();

  preRange.selectNodeContents(element);

  preRange.setEnd(
    range.startContainer,
    range.startOffset,
  );

  return preRange.toString().length;
}