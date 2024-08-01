import React, { memo, forwardRef } from 'react';
import { NewWebShape } from './NewWebShape';
import { BaseProps } from '../types';

const CreateComponent = memo(forwardRef(NewWebShape));

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
