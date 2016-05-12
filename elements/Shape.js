import React, {Component} from 'react';
import './Path'; // must import Path first, don`t know why. without this will throw an `Super expression must either be null or a function, not undefined`
import _ from 'lodash';
import extractProps from '../lib/extract/extractProps';
import {ShapeAttributes} from '../lib/attributes';
import formatPercentageProps from '../lib/formatPercentageProps';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {circleProps, ellipseProps, lineProps, rectProps} from '../lib/props';

/**
 * Circle shape type
 */
const CIRCLE = 0;
/**
 * ELLIPSE shape type
 */
const ELLIPSE = 1;
/**
 * LINE shape type
 */
const LINE = 2;
/**
 * RECT shape type
 */
const RECT = 3;

/**
 * coord props
 */
const COORD_PROPS = {
    /**
     * algorithm for radius in percentage
     * radius = Math.sqrt(Math.pow((width*percent), 2) + Math.pow((height*percent), 2)) / Math.sqrt(2);
     */
    [CIRCLE]: Object.keys(circleProps),
    [ELLIPSE]: Object.keys(ellipseProps),
    [LINE]: Object.keys(lineProps),
    [RECT]: Object.keys(rectProps)
};

/**
 * virtualNode component for shape elements
 */
class Shape extends Component{
    static displayName = 'Shape';

    render() {
        let props = this.props;

        if (this.context.isInGroup) {
            props = _.defaults({}, props, this.context, {
                isInGroup: null
            });
        }

        return <NativeShape
            {...extractProps(this.type === 3 ? {
                ...props,
                x: null,
                y: null
            } : props)}
            shape={{
                ...formatPercentageProps(props, COORD_PROPS[this.type]),
                type: this.type
            }}
        />;
    }
}

let NativeShape = createReactNativeComponentClass({
    validAttributes: ShapeAttributes,
    uiViewClassName: 'RNSVGShape'
});

export default Shape;

export {
    CIRCLE,
    ELLIPSE,
    LINE,
    RECT
};
