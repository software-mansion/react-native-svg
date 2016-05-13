import {PropTypes} from 'react';
import stopsOpacity from '../lib/stopsOpacity';
import {numberProp} from '../lib/props';
import Gradient from './Gradient';
import {RADIAL_GRADIENT} from '../lib/extract/extractBrush';
import insertColorStopsIntoArray from '../lib/insertProcessor';


function RadialGradientGenerator(stops, fx, fy, rx, ry, cx, cy) {
    let brushData = [RADIAL_GRADIENT, ...[fx, fy, rx, ry, cx, cy].map(prop => prop.toString())];
    insertColorStopsIntoArray(stops, brushData, 7);
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
        return super.render(
            (stops, opacity) => {

                return new RadialGradientGenerator(stopsOpacity(stops, opacity), ...[fx, fy, rx || r, ry || r, cx, cy]);
            }
        );
    }
}

export default RadialGradient;
export {RadialGradientGenerator};
