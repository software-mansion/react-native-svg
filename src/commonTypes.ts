import type { ComponentType } from 'react';
import type { SvgProps } from './elements/Svg';

export interface AST {
  tag: string;
  style?: Styles;
  styles?: string;
  priority?: Map<string, boolean | undefined>;
  parent: AST | null;
  children: (AST | string)[] | (JSX.Element | string)[];
  props: {
    [prop: string]: Styles | string | undefined;
  };
  Tag: ComponentType<React.PropsWithChildren>;
}

export interface XmlAST extends AST {
  children: (XmlAST | string)[];
  parent: XmlAST | null;
}

export interface JsxAST extends AST {
  children: (JSX.Element | string)[];
}

export type AdditionalProps = {
  onError?: (error: Error) => void;
  override?: object;
  onLoad?: () => void;
  fallback?: JSX.Element;
};

export type UriProps = SvgProps & { uri: string | null } & AdditionalProps;
export type UriState = { xml: string | null };

export type XmlProps = SvgProps & { xml: string | null } & AdditionalProps;
export type XmlState = { ast: JsxAST | null };

export type AstProps = SvgProps & { ast: JsxAST | null } & AdditionalProps;
export type Styles = { [property: string]: string };
