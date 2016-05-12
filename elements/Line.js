import {PropTypes} from 'react';
import Shape, {LINE} from './Shape';
import {lineProps, pathProps, fillProps, strokeProps} from '../lib/props';

class Line extends Shape{
    static displayName = 'Line';
    static propTypes = {
        ...pathProps,
        ...lineProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...lineProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = LINE;
    }
}

export default Line;
