import React from 'react';
import ForeignObjectNativeComponent from './ForeignObjectNativeComponent';

function ForeignObject(props, ref) {
  return (
    <ForeignObjectNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(ForeignObject);