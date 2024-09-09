import * as React from 'react';

export default function useMergeRefs(
  ...args: ReadonlyArray<React.ElementRef<any>>
): (node: HTMLElement | null) => void {
  return React.useMemo(
    () => mergeRefs(...args),
    // eslint-disable-next-line
    [...args]
  );
}

function mergeRefs(
  ...args: ReadonlyArray<React.ElementRef<any>>
): (node: HTMLElement | null) => void {
  return function forwardRef(node: HTMLElement | null) {
    args.forEach((ref: React.ElementRef<any>) => {
      if (ref == null) {
        return;
      }
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      if (typeof ref === 'object') {
        (ref as any).current = node;
        return;
      }
      console.error(
        `mergeRefs cannot handle Refs of type boolean, number or string, received ref ${String(
          ref
        )}`
      );
    });
  };
}
