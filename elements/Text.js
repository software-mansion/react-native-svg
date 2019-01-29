import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractText from '../lib/extract/extractText';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import extractTransform from '../lib/extract/extractTransform';
import { pickNotNil } from '../lib/util';
import Shape from './Shape';
import './TSpan';

export default class Text extends Shape {
  static displayName = 'Text';

  setNativeProps = props => {
    const matrix = !props.matrix && extractTransform(props);
    if (matrix) {
      props.matrix = matrix;
    }
    const text = pickNotNil(extractText(props, true));
    this.root.setNativeProps({
      ...props,
      ...text,
    });
  };

  render() {
    const props = this.props;
    const prop = propsAndStyles(props);
    return (
      <RNSVGText
        ref={this.refMethod}
        {...extractProps(
          {
            ...prop,
            x: null,
            y: null,
          },
          this,
        )}
        {...extractText(prop, true)}
      />
    );
  }
}

const RNSVGText = requireNativeComponent('RNSVGText');
