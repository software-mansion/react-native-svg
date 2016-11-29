import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps} from '../lib/props';
import {TextAttributes} from '../lib/attributes';
import Shape from './Shape';

class Text extends Shape {
    static displayName = 'Text';

    static propTypes = {
        ...pathProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
        path: PropTypes.string,
        fontFamily: PropTypes.string,
        fontSize: numberProp,
        fontWeight: PropTypes.string,
        fontStyle: PropTypes.string,
        font: PropTypes.object,
        lines: numberProp
    };

    static defaultProps = {
        dx: 0,
        dy: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;

        let x = 0;
        if (props.x) {
            x = props.dx ? +props.x + (+props.dx) : +props.x;
        }
        let y = 0;
        if (props.y) {
            y = props.dy ? +props.y + (+props.dy) : +props.y;
        }

        return <RNSVGText
            ref={ele => {this.root = ele;}}
            {...this.extractProps({...props, x, y})}
            {...extractText(props)}
        />;
    }
}

const RNSVGText = createReactNativeComponentClass({
    validAttributes: TextAttributes,
    uiViewClassName: 'RNSVGText'
});

export default Text;
