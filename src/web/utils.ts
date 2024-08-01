import { BaseProps, CreateComponentProps } from '../types';
import { camelCaseToDashed } from '../utils/index';

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
        default:
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
