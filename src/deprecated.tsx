export function showErrorFunctionCSS(name: string): never {
  throw Error(
    `[react-native-svg] You are trying to import a function: \`${name}\` that has been moved to \`css\` package. Change your import from \`react-native-svg\` to \`react-native-svg/css\`.`
  );
}

export function showErrorComponentCSS(name: string): never {
  throw Error(
    `[react-native-svg] You are trying to import a component: \`${name}\` that has been moved to \`css\` package. Change your import from \`react-native-svg\` to \`react-native-svg/css\`.`
  );
}

export function SvgCss(): never {
  showErrorComponentCSS('SvgCss');
}

export function SvgCssUri(): never {
  showErrorComponentCSS('SvgCssUri');
}

export function SvgWithCss(): never {
  showErrorComponentCSS('SvgWithCss');
}

export function SvgWithCssUri(): never {
  showErrorComponentCSS('SvgWithCssUri');
}

export function inlineStyles(): never {
  showErrorFunctionCSS('inlineStyles');
}

export function LocalSvg(): never {
  showErrorComponentCSS('LocalSvg');
}

export function WithLocalSvg(): never {
  showErrorComponentCSS('WithLocalSvg');
}

export function loadLocalRawResource(): never {
  showErrorFunctionCSS('loadLocalRawResource');
}
