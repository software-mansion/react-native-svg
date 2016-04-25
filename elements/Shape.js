import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';
import extractProps from '../lib/extract/extractProps';
import {ShapeAttributes} from '../lib/attributes';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';

/**
 * Circle shape type
 */
const CIRCLE = 0;

/**
 *
 */
const CIRCLE_COORDS = ['cx', 'cy', 'r'];

const ELLIPSE = 1;
const ELLIPSE_COORDS = ['cx', 'cy', 'rx', 'ry'];

const LINE = 2;
const LINE_COORDS = ['x1', 'y1', 'x2', 'y2'];

const RECT = 5;
const RECT_COORDS = ['x', 'y', 'width', 'height'];


/**
 * virtualNode component for shape elements
 */
class Shape extends Component{
    static displayName = 'Shape';

    render() {
        let {props} = this;

        return <NativePath
            {...props}
            {...extractProps.call(props)}
            shape={new SerializableShape(props).toArray()}
        />;
    }
}

let NativePath = createReactNativeComponentClass({
    validAttributes: ShapeAttributes,
    uiViewClassName: 'RNSVGShape'
});

export default Shape;
