import React from 'react';
import SymbolNativeComponent from './SymbolNativeComponent';

function Symbol(props, ref) {
  return (
    <SymbolNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Symbol);