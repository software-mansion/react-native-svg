import * as React from 'react';
import mergeRefs from './mergeRefs';

export default function useMergeRefs(
  ...args: ReadonlyArray<React.ElementRef<any>>
): (node: HTMLElement | null) => void {
  return React.useMemo(
    () => mergeRefs(...args),
    // eslint-disable-next-line
    [...args]
  );
}
