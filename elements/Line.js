import React, {
    Component,
    PropTypes
} from 'react-native';
import Shape, {LINE} from './Shape';
import {lineProps, pathProps} from '../lib/props';

class Line extends Shape{
    static displayName = 'Line';
    static propTypes = {
        ...pathProps,
        ...lineProps
    };

    static defaultProps = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
    };

    static contextTypes = {
        ...lineProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = LINE;
    };
}

export default Line;
