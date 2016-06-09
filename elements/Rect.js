import React, {PropTypes} from 'react';
import './Path'; // must import Path first, don`t know why. without this will throw an `Super expression must either be null or a function, not undefined`
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import {rectProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';
import Shape from './Shape';

class Rect extends Shape {
    static displayName = 'Rect';
    static propTypes = {
        ...pathProps,
        ...rectProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...rectProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };

    render() {
        let props = mergeContext(this.props, this.context);

        return <RNSVGRect
            {...this.extractProps({
                ...props,
                x: null,
                y: null
            })}
            x={props.x.toString()}
            y={props.y.toString()}
            width={props.width.toString()}
            height={props.height.toString()}
            rx={props.rx ? props.rx.toString() : '0'}
            ry={props.ry ? props.ry.toString() : '0'}
        />;
    }
}

const RNSVGRect = createNativeComponent('RNSVGRect');

export default Rect;
