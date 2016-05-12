import {PropTypes} from 'react';
import Shape, {CIRCLE} from './Shape';
import {circleProps, pathProps, fillProps, strokeProps} from '../lib/props';

class Circle extends Shape{
    static displayName = 'Circle';
    static propTypes = {
        ...pathProps,
        ...circleProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...circleProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = CIRCLE;
    }
}

export default Circle;
