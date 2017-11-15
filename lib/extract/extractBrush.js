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
            let [r, g, b, a = 1] = Color(colorOrBrush).rgb().array();
            return [0, r / 255, g / 255, b / 255, a];
        }
    } catch (err) {
        console.warn(`"${colorOrBrush}" is not a valid color or brush`);
        return null;
    }
}
