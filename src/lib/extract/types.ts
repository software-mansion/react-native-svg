import type {
  ColorValue,
  GestureResponderEvent,
  GestureResponderHandlers,
  LayoutChangeEvent,
  TransformsStyle,
} from 'react-native';
import type React from 'react';

export type NumberProp = string | number;
export type NumberArray = NumberProp[] | NumberProp;

export type FillRule = 'evenodd' | 'nonzero';
export type Units = 'userSpaceOnUse' | 'objectBoundingBox';

export type TextAnchor = 'start' | 'middle' | 'end';
export type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontVariant = 'normal' | 'small-caps';
export type FontWeight =
  | NumberProp
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';
export type FontStretch =
  | 'normal'
  | 'wider'
  | 'narrower'
  | 'ultra-condensed'
  | 'extra-condensed'
  | 'condensed'
  | 'semi-condensed'
  | 'semi-expanded'
  | 'expanded'
  | 'extra-expanded'
  | 'ultra-expanded';
export type TextDecoration =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'blink';
export type FontVariantLigatures = 'normal' | 'none';
export type AlignmentBaseline =
  | 'baseline'
  | 'text-bottom'
  | 'alphabetic'
  | 'ideographic'
  | 'middle'
  | 'central'
  | 'mathematical'
  | 'text-top'
  | 'bottom'
  | 'center'
  | 'top'
  | 'text-before-edge'
  | 'text-after-edge'
  | 'before-edge'
  | 'after-edge'
  | 'hanging';
export type BaselineShift =
  | 'sub'
  | 'super'
  | 'baseline'
  | ReadonlyArray<NumberProp>
  | NumberProp;
export type LengthAdjust = 'spacing' | 'spacingAndGlyphs';

export type TextPathMethod = 'align' | 'stretch';
export type TextPathSpacing = 'auto' | 'exact';
export type TextPathMidLine = 'sharp' | 'smooth';

export type Linecap = 'butt' | 'square' | 'round';
export type Linejoin = 'miter' | 'bevel' | 'round';

export type FilterEdgeMode = 'duplicate' | 'wrap' | 'none';
export type FilterColorMatrixType =
  | 'matrix'
  | 'saturate'
  | 'hueRotate'
  | 'luminanceToAlpha';

export interface TouchableProps {
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  delayPressIn?: number;
  delayPressOut?: number;
  delayLongPress?: number;
}

export interface ResponderProps extends GestureResponderHandlers {
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

export interface FillProps {
  fill?: ColorValue;
  fillOpacity?: NumberProp;
  fillRule?: FillRule;
}

export interface ClipProps {
  clipRule?: FillRule;
  clipPath?: string;
}

export interface VectorEffectProps {
  vectorEffect?:
    | 'none'
    | 'non-scaling-stroke'
    | 'nonScalingStroke'
    | 'default'
    | 'inherit'
    | 'uri';
}

export interface DefinitionProps {
  id?: string;
}

export interface StrokeProps {
  stroke?: ColorValue;
  strokeWidth?: NumberProp;
  strokeOpacity?: NumberProp;
  strokeDasharray?: ReadonlyArray<NumberProp> | NumberProp;
  strokeDashoffset?: NumberProp;
  strokeLinecap?: Linecap;
  strokeLinejoin?: Linejoin;
  strokeMiterlimit?: NumberProp;
  vectorEffect?: VectorEffect;
}

export type VectorEffect =
  | 'none'
  | 'non-scaling-stroke'
  | 'nonScalingStroke'
  | 'default'
  | 'inherit'
  | 'uri';

export interface FontObject {
  fontStyle?: FontStyle;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStretch?: FontStretch;
  fontSize?: NumberProp;
  fontFamily?: string;
  textAnchor?: TextAnchor;
  textDecoration?: TextDecoration;
  letterSpacing?: NumberProp;
  wordSpacing?: NumberProp;
  kerning?: NumberProp;
  fontFeatureSettings?: string;
  fontVariantLigatures?: FontVariantLigatures;
  fontVariationSettings?: string;
}

export interface FontProps extends FontObject {
  font?: FontObject;
}

/*

  ColumnMajorTransformMatrix

  [a, b, c, d, tx, ty]

  This matrix can be visualized as:

  ╔═      ═╗
  ║ a c tx ║
  ║ b d ty ║
  ║ 0 0 1  ║
  ╚═      ═╝

*/
export type ColumnMajorTransformMatrix = [
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface TransformProps {
  translate?: NumberArray;
  translateX?: NumberProp;
  translateY?: NumberProp;
  origin?: NumberArray;
  originX?: NumberProp;
  originY?: NumberProp;
  scale?: NumberArray;
  scaleX?: NumberProp;
  scaleY?: NumberProp;
  skew?: NumberArray;
  skewX?: NumberProp;
  skewY?: NumberProp;
  rotation?: NumberProp;
  x?: NumberArray;
  y?: NumberArray;
  transform?:
    | ColumnMajorTransformMatrix
    | string
    | TransformsStyle['transform'];
}

export interface TransformedProps {
  rotation: number;
  originX: number;
  originY: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  x: number;
  y: number;
}

export type MaskType = 'alpha' | 'luminance';

export interface CommonMaskProps {
  mask?: string;
}

export interface CommonFilterProps {
  filter?: string;
}

export interface CommonMarkerProps {
  marker?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
}

export interface NativeProps {
  onLayout?: (event: LayoutChangeEvent) => void;
}

export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessible?: boolean;
  testID?: string;
}

// FIXME: This interface should probably be named CommonRenderableProps
export interface CommonPathProps
  extends FillProps,
    StrokeProps,
    ClipProps,
    TransformProps,
    VectorEffectProps,
    ResponderProps,
    TouchableProps,
    DefinitionProps,
    CommonMarkerProps,
    CommonMaskProps,
    CommonFilterProps,
    NativeProps,
    AccessibilityProps {}

export type ResponderInstanceProps = {
  touchableHandleResponderMove?: (e: GestureResponderEvent) => void;
  touchableHandleResponderGrant?: (e: GestureResponderEvent) => void;
  touchableHandleResponderRelease?: (e: GestureResponderEvent) => void;
  touchableHandleResponderTerminate?: (e: GestureResponderEvent) => void;
  touchableHandleStartShouldSetResponder?: (
    e: GestureResponderEvent
  ) => boolean;
  touchableHandleResponderTerminationRequest?: (
    e: GestureResponderEvent
  ) => boolean;
};

export type extractedProps = {
  name?: string;
  mask?: string;
  opacity?: number;
  matrix?: number[];
  propList?: string[];
  onLayout?: (event: LayoutChangeEvent) => void;
  ref?: (instance: React.Component | null) => void;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
  clipPath?: string;
  clipRule?: number;
  display?: string;
  testID?: string;
  accessibilityLabel?: string;
  accessible?: boolean;
  [touchableProperty: string]: unknown;
};

export interface TextSpecificProps extends CommonPathProps, FontProps {
  alignmentBaseline?: AlignmentBaseline;
  baselineShift?: BaselineShift;
  verticalAlign?: NumberProp;
  lengthAdjust?: LengthAdjust;
  textLength?: NumberProp;
  fontData?: null | { [name: string]: unknown };
  fontFeatureSettings?: string;
}
