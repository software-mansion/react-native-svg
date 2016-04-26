import React, {
    Component,
    PropTypes
} from 'react-native';
import Shape, {RECT} from './Shape';
import {rectProps, pathProps, fillProps, strokeProps} from '../lib/props';

class Rect extends Shape{
    static displayName = 'Rect';
    static propTypes = {
        ...pathProps,
        ...rectProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...rectProps,
        isInGroup: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.type = RECT;
    };


}

export default Rect;
