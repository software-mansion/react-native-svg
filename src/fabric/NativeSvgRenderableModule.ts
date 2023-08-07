/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Int32, Float } from 'react-native/Libraries/Types/CodegenTypes';

type Rect = {
  x: Float;
  y: Float;
  width: Float;
  height: Float;
};

type Matrix = {
  a: Float;
  b: Float;
  c: Float;
  d: Float;
  e: Float;
  f: Float;
};

type Point = {
  x: Float;
  y: Float;
};

export interface Spec extends TurboModule {
  isPointInFill(tag: Int32 | null, options?: Object): boolean;
  isPointInStroke(tag: Int32 | null, options?: Object): boolean;
  getTotalLength(tag: Int32 | null): Float;
  getPointAtLength(tag: Int32 | null, options?: Object): Point;
  getBBox(tag: Int32 | null, options?: Object): Rect;
  getCTM(tag: Int32 | null): Matrix;
  getScreenCTM(tag: Int32 | null): Matrix;
  getRawResource(name: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGRenderableModule');
