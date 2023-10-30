export function showErrorCSS(name: string): never {
  throw Error(
    `You are trying to import a component/function: \`${name}\` that has been moved to \`css\` package. Change your import from \`react-native-svg\` to \`react-native-svg/css\`.`
  );
}

export function SvgCss(): never {
  showErrorCSS('SvgCss');
}

export function SvgCssUri(): never {
  showErrorCSS('SvgCssUri');
}

export function SvgWithCss(): never {
  showErrorCSS('SvgWithCss');
}

export function SvgWithCssUri(): never {
  showErrorCSS('SvgWithCssUri');
}

export function inlineStyles(): never {
  showErrorCSS('inlineStyles');
}

export function LocalSvg(): never {
  showErrorCSS('LocalSvg');
}

export function WithLocalSvg(): never {
  showErrorCSS('WithLocalSvg');
}

export function loadLocalRawResource(): never {
  showErrorCSS('loadLocalRawResource');
}
