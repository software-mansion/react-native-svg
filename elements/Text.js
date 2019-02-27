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
    const prop = propsAndStyles(props);
    const text = pickNotNil(extractText(prop, true));
    this.root.setNativeProps({
      ...prop,
      ...text,
    });
  };

  render() {
    const prop = propsAndStyles(this.props);
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
