export const camelCaseToDashed = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
};

export const getBoundingClientRect = (node: SVGElement) => {
  if (node) {
    const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect();
    }
  }
  throw new Error('Can not get boundingClientRect of ' + node || 'undefined');
};

/* Taken from here: https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0 */
export function encodeSvg(svgString: string) {
  return svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"'
    )
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ');
}
