import Color from 'color';
let noneFill = ['transparent', 'none'];
export default function (color, opacity) {
    if (noneFill.indexOf(color) !== -1 || !color) {
        return Color('#000');
    } else {
        let c = Color(color);

        if (!isNaN(opacity)) {
            c = c.alpha(opacity);
        }
        return c;
    }
}
