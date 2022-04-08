import React from 'react';
import GroupNativeComponent from './GroupNativeComponent';

function Group(props, ref) {
  return (
    <GroupNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Group);