import React, {
    PropTypes
} from 'react-native';
import Shape, {ELLIPSE} from './Shape';
import {ellipseProps, pathProps, fillProps, strokeProps} from '../lib/props';

class Ellipse extends Shape{
    static displayName = 'Ellipse';
    static propTypes = {
        ...pathProps,
        ...ellipseProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...ellipseProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = ELLIPSE;
    }
}

export default Ellipse;
