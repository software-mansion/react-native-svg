import {PropTypes} from 'react';
import stopsOpacity from '../lib/stopsOpacity';
import {numberProp} from '../lib/props';
import Gradient from './Gradient';
import {LINEAR_GRADIENT} from '../lib/extract/extractBrush';
import insertColorStopsIntoArray from '../lib/insertProcessor';

function LinearGradientGenerator(stops, x1, y1, x2, y2) {
    let brushData = [LINEAR_GRADIENT, ...[x1, y1, x2, y2].map(prop => prop.toString())];
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
        return super.render(
            (stops, opacity) => {
                return new LinearGradientGenerator(stopsOpacity(stops, opacity), ...[x1, y1, x2, y2]);
            }
        );
    }
}

export default LinearGradient;
export {LinearGradientGenerator};
