import React, { memo, forwardRef, PropsWithoutRef } from 'react';
import { WebShape } from './WebShape';
import type { BaseProps } from '../types';

const CreateComponent = memo(forwardRef(WebShape));

export const createComponent = <T,>(
  tag: keyof JSX.IntrinsicElements,
  prepareProps?: (
    props: PropsWithoutRef<BaseProps & Omit<T, 'tag'>>
  ) => PropsWithoutRef<BaseProps & Omit<T, 'tag'>>
) => {
  return forwardRef<T, BaseProps & Omit<T, 'tag'>>((props, ref) => {
    let createComponentProps = props;
    if (prepareProps) {
      createComponentProps = prepareProps(props);
    }

    return <CreateComponent {...createComponentProps} tag={tag} ref={ref} />;
  });
};
