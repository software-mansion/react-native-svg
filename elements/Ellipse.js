import React, {
    Component,
    PropTypes
} from 'react-native';
import Shape, {ELLIPSE} from './Shape';
import {ellipseProps, pathProps} from '../lib/props';

class Ellipse extends Shape{
    static displayName = 'Ellipse';
    static propTypes = {
        ...pathProps,
        ...ellipseProps
    };

    static defaultProps = {
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0
    };

    static contextTypes = {
        ...ellipseProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = ELLIPSE;
    };
}

export default Ellipse;
