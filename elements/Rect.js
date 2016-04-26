import React, {
    Component,
    PropTypes
} from 'react-native';
import Shape, {RECT} from './Shape';
import {rectProps, pathProps} from '../lib/props';

class Rect extends Shape{
    static displayName = 'Rect';
    static propTypes = {
        ...pathProps,
        ...rectProps
    };

    static defaultProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rx: 0,
        ry: 0
    };

    static contextTypes = {
        ...rectProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = RECT;
    };


}

export default Rect;
