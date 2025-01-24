import React from 'react';
import FilterPrimitive from './FilterPrimitive';

export interface FeMergeNodeProps {
  in?: string;
  parent?: React.Component;
}

export default class FeMergeNode extends FilterPrimitive<FeMergeNodeProps> {
  static displayName = 'FeMergeNode';

  // Force update parent
  setNativeProps = () => {
    const { parent } = this.props;
    if (parent) {
      parent.forceUpdate();
    }
  };

  render() {
    return null;
  }
}
