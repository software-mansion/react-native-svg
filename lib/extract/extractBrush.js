import Color from 'color';
const SOLID_COLOR = 0;
const LINEAR_GRADIENT = 1;
const RADIAL_GRADIENT = 2;
const PATTERN = 3;

export default function (colorOrBrush) {
    if (!colorOrBrush) {
        return null;
    }
    if (colorOrBrush._brush) {
        return colorOrBrush._brush;
    }

    let c = new Color(colorOrBrush).rgbaArray();
    return [SOLID_COLOR, c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
}

export {
    LINEAR_GRADIENT,
    RADIAL_GRADIENT,
    PATTERN
};
