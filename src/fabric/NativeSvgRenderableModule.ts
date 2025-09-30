/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Double, Float } from 'react-native/Libraries/Types/CodegenTypes';

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
  isPointInFill(tag: Double | null, options?: Object): boolean;
  isPointInStroke(tag: Double | null, options?: Object): boolean;
  getTotalLength(tag: Double | null): Float;
  getPointAtLength(tag: Double | null, options?: Object): Point;
  getBBox(tag: Double | null, options?: Object): Rect;
  getCTM(tag: Double | null): Matrix;
  getScreenCTM(tag: Double | null): Matrix;
  getRawResource(name: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGRenderableModule');
