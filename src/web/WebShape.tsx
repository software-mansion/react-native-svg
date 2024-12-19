import React, { useImperativeHandle, useRef } from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
import { useMergeRefs } from './webUtils.web';
import type { CreateComponentProps } from '../types';
import { prepare } from './utils/prepare';
import { useHandleEvents } from './hooks/useHandleEvents';
import { setNativeProps } from './utils/setNativeProps';
import { encodeSvg, getBoundingClientRect } from './utils';

export const WebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  const currentRef = useRef<SVGElement | null>(null);
  const { elementRef, rest, onClick } = useHandleEvents(currentRef, props);
  const lastMergedProps = useRef<Partial<typeof rest>>({});

  setNativeProps(
    rest,
    elementRef as React.MutableRefObject<SVGElement | null>,
    lastMergedProps
  );
  const prep = prepare({ ...rest, elementRef });
  const setRef = useMergeRefs(prep.ref, forwardedRef);

  if (Tag === 'svg') {
    useImperativeHandle(
      forwardedRef as React.MutableRefObject<any | null>,
      () => {
        return {
          toDataURL(
            callback: (data: string) => void,
            options: { width?: number; height?: number } = {}
          ) {
            const ref = elementRef.current as SVGElement;

            if (ref === null) {
              return;
            }
            const rect = getBoundingClientRect(ref);

            const width = Number(options.width) || rect.width;
            const height = Number(options.height) || rect.height;

            const svg = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'svg'
            );
            svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
            svg.setAttribute('width', String(width));
            svg.setAttribute('height', String(height));
            svg.appendChild(ref.cloneNode(true));

            const img = new window.Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext('2d');
              context?.drawImage(img, 0, 0);
              callback(
                canvas.toDataURL().replace('data:image/png;base64,', '')
              );
            };
            img.src = `data:image/svg+xml;utf8,${encodeSvg(
              new window.XMLSerializer().serializeToString(svg)
            )}`;
          },
        };
      },
      []
    );
  }
  return createElement(Tag, {
    ...prep,
    onClick,
    collapsable: undefined,
    ref: setRef,
  });
};
