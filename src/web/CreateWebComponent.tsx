import React from 'react';
import { WebShape } from './WebShape';
import { BaseProps } from '../types';

const CreateComponent = React.forwardRef(WebShape);

export const createComponent = <T,>(
  tag: keyof JSX.IntrinsicElements,
  prepareProps?: (props: BaseProps & Omit<T, 'tag'>) => Omit<T, 'tag'>
) => {
  return React.forwardRef<T, Omit<T, 'tag'>>((props, ref) => {
    let createComponentProps = props;
    if (prepareProps) {
      createComponentProps = prepareProps(props);
    }
    return <CreateComponent {...createComponentProps} tag={tag} ref={ref} />;
  });
};
