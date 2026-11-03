/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { CodegenTypes, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type Rect = {
  x: CodegenTypes.Float;
  y: CodegenTypes.Float;
  width: CodegenTypes.Float;
  height: CodegenTypes.Float;
};

type Matrix = {
  a: CodegenTypes.Float;
  b: CodegenTypes.Float;
  c: CodegenTypes.Float;
  d: CodegenTypes.Float;
  e: CodegenTypes.Float;
  f: CodegenTypes.Float;
};

type Point = {
  x: CodegenTypes.Float;
  y: CodegenTypes.Float;
};

export interface Spec extends TurboModule {
  isPointInFill(tag: CodegenTypes.Double | null, options?: Object): boolean;
  isPointInStroke(tag: CodegenTypes.Double | null, options?: Object): boolean;
  getTotalLength(tag: CodegenTypes.Double | null): CodegenTypes.Float;
  getPointAtLength(tag: CodegenTypes.Double | null, options?: Object): Point;
  getBBox(tag: CodegenTypes.Double | null, options?: Object): Rect;
  getCTM(tag: CodegenTypes.Double | null): Matrix;
  getScreenCTM(tag: CodegenTypes.Double | null): Matrix;
  getRawResource(name: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGRenderableModule');
