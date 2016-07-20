import Color from 'color';
import _ from 'lodash';
import patternReg from './patternReg';

export default function (colorOrBrush) {
    if (colorOrBrush === 'none') {
        return null;
    } else if (_.isNil(colorOrBrush)) {
        colorOrBrush = '#000';
    }

    let matched = colorOrBrush.match(patternReg);

    // brush
    if (matched) {
        return [1, matched[1]];
        //todo:
    } else { // solid color
        let c = new Color(colorOrBrush).rgbaArray();
        return [0, c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
    }
}
