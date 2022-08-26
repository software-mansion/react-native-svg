// @ts-ignore TODO: remove once there is a .d.ts file with definitions
import codegenNativeComponentUntyped from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, HostComponent, ColorValue } from 'react-native';
import type {
  Float,
  Int32,
  WithDefault,
  // @ts-ignore TODO: remove once there is a .d.ts file with definitions
} from 'react-native/Libraries/Types/CodegenTypes';

interface SvgNodeCommonProps {
  name?: string;
  opacity?: WithDefault<Float, 1.0>;
  matrix?: ReadonlyArray<Float>;
  // transform?: ____TransformStyle_Internal, // CATransform3D, custom handling
  mask?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
  clipPath?: string;
  clipRule?: WithDefault<Int32, 0>;
  responsible?: boolean;
  display?: string;
}

type ColorStruct = Readonly<{
  type?: WithDefault<Int32, -1>;
  value?: ColorValue;
  brushRef?: string;
}>;

interface SvgRenderableCommonProps {
  fill?: ColorStruct;
  fillOpacity?: WithDefault<Float, 1.0>;
  fillRule?: WithDefault<Int32, 1>;
  stroke?: ColorStruct;
  strokeOpacity?: WithDefault<Float, 1.0>;
  strokeWidth?: WithDefault<string, '1'>;
  strokeLinecap?: WithDefault<Int32, 0>;
  strokeLinejoin?: WithDefault<Int32, 0>;
  strokeDasharray?: ReadonlyArray<string>;
  strokeDashoffset?: Float;
  strokeMiterlimit?: Float;
  vectorEffect?: WithDefault<Int32, 0>;
  propList?: ReadonlyArray<string>;
}

type FontObject = Readonly<{
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: string;
  fontStretch?: string;
  fontSize?: string;
  fontFamily?: string;
  textAnchor?: string;
  textDecoration?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  kerning?: string;
  fontFeatureSettings?: string;
  fontVariantLigatures?: string;
  fontVariationSettings?: string;
}>;

type SvgGroupCommonProps = Readonly<{
  fontSize?: string;
  fontWeight?: string;
  font?: FontObject;
}>;

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps,
    SvgGroupCommonProps {
  refX?: string;
  refY?: string;
  markerHeight?: string;
  markerWidth?: string;
  markerUnits?: string;
  orient?: string;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const codegenNativeComponent = codegenNativeComponentUntyped as <T extends {}>(
  name: string,
) => HostComponent<T>;

export default codegenNativeComponent<NativeProps>('RNSVGMarker');
