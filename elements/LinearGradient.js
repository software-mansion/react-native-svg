import React, {
    Component,
    PropTypes,
    Children
} from 'react-native';

import stopsOpacity from '../lib/stopsOpacity';
import {numberProp} from '../lib/props';
import Gradient from './Gradient';
import {LINEAR_GRADIENT} from '../lib/extract/extractBrush';
import insertColorStopsIntoArray from '../lib/insertProcessor';

function LinearGradientGenerator(stops, x1, y1, x2, y2) {
    var type = LINEAR_GRADIENT;

    if (arguments.length < 5) {
        var angle = ((x1 == null) ? 270 : x1) * Math.PI / 180;

        var x = Math.cos(angle);
        var y = -Math.sin(angle);
        var l = (Math.abs(x) + Math.abs(y)) / 2;

        x *= l; y *= l;

        x1 = 0.5 - x;
        x2 = 0.5 + x;
        y1 = 0.5 - y;
        y2 = 0.5 + y;
        this._bb = true;
    } else {
        this._bb = false;
    }
    var brushData = [type, +x1, +y1, +x2, +y2];
    insertColorStopsIntoArray(stops, brushData, 5);
    this._brush = brushData;
}


class LinearGradient extends Gradient{
    static displayName = 'LinearGradient';
    static propTypes = {
        x1: numberProp,
        x2: numberProp,
        y1: numberProp,
        y2: numberProp,
        id: PropTypes.string.isRequired
    };

    render() {
        let {
            x1,
            y1,
            x2,
            y2
        } = this.props;
        let gradientProps = [x1, y1, x2, y2];
        return super.render(
            gradientProps,
            function (factories, stops, boundingBox, opacity) {
                return new LinearGradientGenerator(
                    stopsOpacity(stops, opacity),
                    factories[0](boundingBox.width),
                    factories[1](boundingBox.height),
                    factories[2](boundingBox.width),
                    factories[3](boundingBox.height)
                );
            },
            function (stops, opacity) {
                return new LinearGradientGenerator(stopsOpacity(stops, opacity), ...gradientProps);
            }
        );
    }
}

export default LinearGradient;
export {LinearGradientGenerator};
