import Color from 'color';
let noneFill = ['transparent', 'none'];
export default function (color, opacity = 1) {
    if (noneFill.indexOf(color) !== -1 || !color) {
        return Color('#000');
    } else {
        return Color(color).alpha(+opacity);
    }
}
