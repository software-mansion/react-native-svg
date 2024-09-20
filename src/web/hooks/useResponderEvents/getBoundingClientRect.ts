const getBoundingClientRect = (
  node?: HTMLElement | null
): undefined | ClientRect => {
  if (node != null) {
    const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect();
    }
  }
};

export default getBoundingClientRect;
