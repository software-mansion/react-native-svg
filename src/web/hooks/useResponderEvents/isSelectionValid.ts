export default function isSelectionValid(): boolean {
  const selection = window.getSelection();
  if (!selection) return false;
  const string = selection.toString();
  const anchorNode = selection.anchorNode!;
  const focusNode = selection.focusNode!;
  const isTextNode =
    (anchorNode && anchorNode.nodeType === window.Node.TEXT_NODE) ||
    (focusNode && focusNode.nodeType === window.Node.TEXT_NODE);
  return string.length >= 1 && string !== '\n' && isTextNode;
}
