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
    Object.assign(prop, pickNotNil(extractText(prop, true)));
    this.root.setNativeProps(prop);
  };

  render() {
    const prop = propsAndStyles(this.props);
    const props = extractProps(
      {
        ...prop,
        x: null,
        y: null,
      },
      this,
    );
    Object.assign(props, extractText(prop, true));
    props.ref = this.refMethod;
    return <RNSVGText {...props} />;
  }
}

const RNSVGText = requireNativeComponent('RNSVGText');
