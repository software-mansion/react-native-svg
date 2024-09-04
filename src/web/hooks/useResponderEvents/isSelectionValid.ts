export default function isSelectionValid(): boolean | null | undefined {
  const selection = window.getSelection();
  const string = selection?.toString();
  const anchorNode = selection?.anchorNode;
  const focusNode = selection?.focusNode;
  const isTextNode =
    (anchorNode && anchorNode.nodeType === window.Node.TEXT_NODE) ||
    (focusNode && focusNode.nodeType === window.Node.TEXT_NODE);
  return string!.length >= 1 && string !== '\n' && isTextNode;
}
