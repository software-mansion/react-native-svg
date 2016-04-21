import React, {
    Component,
    PropTypes,
    Children
} from 'react-native';
import stopsOpacity from '../lib/stopsOpacity';
import numberProp from '../lib/numberProp';
import Gradient from './Gradient';
import {RADIAL_GRADIENT} from '../lib/extract/extractBrush';
import {insertDoubleColorStopsIntoArray} from '../lib/insertProcessor';


function RadialGradientGenerator(stops, fx, fy, rx, ry, cx, cy) {
    if (ry == null) {
        ry = rx;
    }
    if (cx == null) {
        cx = fx;
    }
    if (cy == null) {
        cy = fy;
    }
    if (fx == null) {
        // As a convenience we allow the whole radial gradient to cover the
        // bounding box. We should consider dropping this API.
        fx = fy = rx = ry = cx = cy = 0.5;
        this._bb = true;
    } else {
        this._bb = false;
    }
    // The ART API expects the radial gradient to be repeated at the edges.
    // To simulate this we render the gradient twice as large and add double
    // color stops. Ideally this API would become more restrictive so that this
    // extra work isn't needed.
    var brushData = [RADIAL_GRADIENT, +fx, +fy, +rx * 2, +ry * 2, +cx, +cy];
    insertDoubleColorStopsIntoArray(stops, brushData, 7);
    this._brush = brushData;
}

class RadialGradient extends Gradient{
    static displayName = 'RadialGradient';
    static propTypes = {
        fx: numberProp,
        fy: numberProp,
        rx: numberProp,
        ry: numberProp,
        cx: numberProp,
        cy: numberProp,
        r: numberProp,
        id: PropTypes.string.isRequired
    };

    render() {
        let {
            fx,
            fy,
            rx,
            ry,
            cx,
            cy,
            r
        } = this.props;

        let gradientProps = [fx, fy, rx || r, ry || r, cx, cy];
        return super.render(
            gradientProps,
            function (factories, stops, boundingBox, opacity) {
                let {x1,y1,width, height} = boundingBox;
                return new RadialGradientGenerator(
                    stopsOpacity(stops, opacity),
                    x1 + factories[0](width),
                    y1 + factories[1](height),
                    factories[2](width),
                    factories[3](height),
                    x1 + factories[4](width),
                    y1 + factories[5](height)
                );
            },
            function (stops, opacity) {
                return new RadialGradientGenerator(stopsOpacity(stops, opacity), ...gradientProps);
            }
        );
    }
}

export default RadialGradient;
export {RadialGradientGenerator};
