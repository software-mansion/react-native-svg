import { BaseProps, CreateComponentProps } from '../../types';
import { camelCaseToDashed } from '.';
import { convertInt32ColorToRGBA } from './convertInt32Color';

export const setNativeProps = (
  nativeProps: BaseProps,
  elementRef: React.MutableRefObject<SVGElement | null>,
  lastMergedProps: React.MutableRefObject<Partial<CreateComponentProps>>
) => {
  const { style, ...rest } = nativeProps;
  if (elementRef.current) {
    const current = elementRef.current;

    // Set attributes and styles
    Object.keys(rest).forEach((cleanAttribute) => {
      const cleanValue = rest[cleanAttribute as keyof typeof rest];
      switch (cleanAttribute) {
        case 'ref':
        case 'children':
          break;
        case 'style':
          Object.assign(current.style, cleanValue);
          break;
        case 'fill':
          if (cleanValue && typeof cleanValue === 'object') {
            current.setAttribute(
              'fill',
              convertInt32ColorToRGBA(
                (cleanValue as { payload: number }).payload
              )
            );
          }
          break;
        case 'stroke':
          if (cleanValue && typeof cleanValue === 'object') {
            current.setAttribute(
              'stroke',
              convertInt32ColorToRGBA(
                (cleanValue as { payload: number }).payload
              )
            );
          }
          break;
        default:
          // apply all other incoming prop updates as attributes on the node
          // same logic as in https://github.com/software-mansion/react-native-reanimated/blob/d04720c82f5941532991b235787285d36d717247/src/reanimated2/js-reanimated/index.ts#L38-L39
          current.setAttribute(
            camelCaseToDashed(cleanAttribute),
            String(cleanValue)
          );
          break;
      }
    });

    const mergedProps = { ...rest, style };
    const mergedStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    const merged = { ...mergedProps, style: mergedStyle };
    lastMergedProps.current = merged;
  }
};
