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

const measureLayout = (
  node: SVGElement,
  callback: (
    x: number,
    y: number,
    width: number,
    height: number,
    left: number,
    top: number
  ) => void
) => {
  const relativeNode = node?.parentNode;
  if (relativeNode) {
    setTimeout(() => {
      // @ts-expect-error TODO: handle it better
      const relativeRect = getBoundingClientRect(relativeNode);
      const { height, left, top, width } = getBoundingClientRect(node);
      const x = left - relativeRect.left;
      const y = top - relativeRect.top;
      callback(x, y, width, height, left, top);
    }, 0);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function remeasure(this: any) {
  const tag = this.state.touchable.responderID;
  if (tag === null) {
    return;
  }
  measureLayout(tag, this._handleQueryLayout);
}

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

const KEEP_CAMEL_CASE = new Set([
  'stdDeviation',
  'edgeMode',
  'kernelMatrix',
  'kernelUnitLength',
  'preserveAlpha',
  'baseFrequency',
  'targetX',
  'targetY',
  'numOctaves',
  'stitchTiles',
  'filterUnits',
  'primitiveUnits',
  'pathLength',
  'gradientUnits',
  'gradientTransform',
  'spreadMethod',
  'markerHeight',
  'markerUnits',
  'markerWidth',
  'viewBox',
  'refX',
  'refY',
  'maskContentUnits',
  'maskUnits',
  'patternContentUnits',
  'patternTransform',
  'patternUnits',
  'textLength',
  'lengthAdjust',
  'startOffset',
  'clipPathUnits',
]);

export const getAttributeName = (attr: string) => {
  return KEEP_CAMEL_CASE.has(attr) ? attr : camelCaseToDashed(attr);
};

const toDataUri = (url: string) =>
  fetch(url)
    .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const XLINK_NS = 'http://www.w3.org/1999/xlink';
const CSS_URL = /url\((['"]?)(.*?)\1\)/g;

const parseFontFamilies = (fontFamily: string) =>
  fontFamily
    .split(',')
    .map((family) => family.trim().replace(/^['"]|['"]$/g, ''));

/**
 * Inlines external images and the `@font-face` fonts in use into `clone` as
 * data URIs, since an SVG drawn through `<img>` can't load them.
 *
 * @param {SVGElement} clone Copy of the SVG to inline resources into.
 * @param {SVGElement} source Rendered original, used to read the fonts in use.
 * @returns {Promise<void>} Resolves once everything is inlined.
 * @private
 */
export async function inlineExternalResources(
  clone: SVGElement,
  source: SVGElement
) {
  const images = Array.from(clone.querySelectorAll('image, feImage'));
  const inlineImages = images.map(async (image) => {
    const url =
      image.getAttribute('href') ?? image.getAttributeNS(XLINK_NS, 'href');
    if (!url || url.startsWith('data:') || url.startsWith('#')) {
      return;
    }
    try {
      image.setAttribute('href', await toDataUri(url));
      image.removeAttributeNS(XLINK_NS, 'href');
    } catch {}
  });

  const usedFamilies = new Set<string>();
  [source, ...Array.from(source.querySelectorAll('text, tspan'))].forEach(
    (node) =>
      parseFontFamilies(window.getComputedStyle(node).fontFamily).forEach(
        (family) => usedFamilies.add(family)
      )
  );

  const fontFaces: Promise<string>[] = [];
  Array.from(document.styleSheets).forEach((sheet) => {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      return; // cross-origin stylesheet
    }
    Array.from(rules).forEach((rule) => {
      if (
        !(rule instanceof CSSFontFaceRule) ||
        !usedFamilies.has(
          parseFontFamilies(rule.style.getPropertyValue('font-family'))[0]
        )
      ) {
        return;
      }
      const urls: string[] = [];
      rule.cssText.replace(CSS_URL, (_match, _quote, url: string) => {
        urls.push(url);
        return '';
      });
      const baseUrl = sheet.href ?? document.baseURI;
      fontFaces.push(
        Promise.all(
          urls.map((url) =>
            url.startsWith('data:')
              ? url
              : toDataUri(new URL(url, baseUrl).href).catch(() => url)
          )
        ).then((dataUris) => {
          let i = 0;
          return rule.cssText.replace(CSS_URL, () => `url("${dataUris[i++]}")`);
        })
      );
    });
  });

  const css = await Promise.all(fontFaces);
  await Promise.all(inlineImages);
  if (css.length > 0) {
    const style = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'style'
    );
    style.textContent = css.join('\n');
    clone.insertBefore(style, clone.firstChild);
  }
}
