import Color from 'color';
import patternReg from './patternReg';

export default function (colorOrBrush) {
    if (colorOrBrush === 'none' || !colorOrBrush) {
        return null;
    }

    try {
        let matched = colorOrBrush.match(patternReg);
        // brush
        if (matched) {
            return [1, matched[1]];
            //todo:
        } else { // solid color
            let c = Color(colorOrBrush).unitArray();
            // Color returns an array of length 3 when alpha = 1
            // if use c[3], this array would be of length 5 and contains null value
            return [0, ...c];
        }
    } catch (err) {
        console.warn(`"${colorOrBrush}" is not a valid color or brush`);
        return null;
    }
}
