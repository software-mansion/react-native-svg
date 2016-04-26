import React, {
    Component,
    PropTypes
} from 'react-native';
import Shape, {CIRCLE} from './Shape';
import {circleProps, pathProps} from '../lib/props';
import _ from 'lodash';

class Circle extends Shape{
    static displayName = 'Circle';
    static propTypes = {
        ...pathProps,
        ...circleProps
    };

    static defaultProps = {
        cx: 0,
        cy: 0,
        r: 0
    };

    static contextTypes = {
        ...circleProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = CIRCLE;
    };
}

export default Circle;
