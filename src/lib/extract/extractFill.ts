import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import type { extractedProps, FillProps } from './types';
import { processColor } from 'react-native';

const fillRules: { evenodd: number; nonzero: number } = {
  evenodd: 0,
  nonzero: 1,
};

const defaultFill = { type: 0, payload: processColor('black') };

export default function extractFill(
  o: extractedProps,
  props: FillProps,
  inherited: string[],
) {
  const { fill, fillRule, fillOpacity } = props;
  if (fill != null) {
    inherited.push('fill');
    o.fill =
      !fill && typeof fill !== 'number' ? defaultFill : extractBrush(fill);
  }
  // When `fill` is not set on this element we deliberately emit no `fill` value
  // and do not add it to `propList`, so the native side inherits fill from the
  // parent (e.g. a root <Svg fill="none">). Previously we emitted the black
  // spec-default here even though 'fill' was absent from propList; on platforms
  // that apply the emitted value unconditionally (react-native-windows) this
  // clobbered inheritance and painted a black fill on stroke-only shapes. The
  // SVG black default is still honored for a genuinely unset root because the
  // native node's own default fill is black.
  if (fillOpacity != null) {
    inherited.push('fillOpacity');
    o.fillOpacity = extractOpacity(fillOpacity);
  }
  if (fillRule != null) {
    inherited.push('fillRule');
    o.fillRule = fillRule && fillRules[fillRule] === 0 ? 0 : 1;
  }
}
