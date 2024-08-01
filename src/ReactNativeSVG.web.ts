import {
  AstProps,
  camelCase,
  fetchText,
  JsxAST,
  Middleware,
  parse,
  Styles,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
} from './xml';

export {
  inlineStyles,
  loadLocalRawResource,
  LocalSvg,
  SvgCss,
  SvgCssUri,
  SvgWithCss,
  SvgWithCssUri,
  WithLocalSvg,
} from './deprecated';

export {
  camelCase,
  fetchText,
  parse,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
};

export * from './lib/extract/types';

export * from './elements';
export { default } from './elements';
export type {
  AstProps,
  JsxAST,
  Middleware,
  Styles,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
};
