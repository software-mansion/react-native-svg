export function showErrorCSS(name: string, type: string): never {
  throw Error(
    `[react-native-svg] You are trying to import a ${type} \`${name}\` that has been moved to a sub-package. Change your import from \`react-native-svg\` to \`react-native-svg/css\`.`
  );
}

export function SvgCss(): never {
  showErrorCSS('SvgCss', 'component');
}

export function SvgCssUri(): never {
  showErrorCSS('SvgCssUri', 'component');
}

export function SvgWithCss(): never {
  showErrorCSS('SvgWithCss', 'component');
}

export function SvgWithCssUri(): never {
  showErrorCSS('SvgWithCssUri', 'component');
}

export function inlineStyles(): never {
  showErrorCSS('inlineStyles', 'function');
}

export function LocalSvg(): never {
  showErrorCSS('LocalSvg', 'component');
}

export function WithLocalSvg(): never {
  showErrorCSS('WithLocalSvg', 'component');
}

export function loadLocalRawResource(): never {
  showErrorCSS('loadLocalRawResource', 'function');
}
