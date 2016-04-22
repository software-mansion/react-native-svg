import Color from 'color';
const SOLID_COLOR = 0;
const LINEAR_GRADIENT = 1;
const RADIAL_GRADIENT = 2;
const PATTERN = 3;

function applyBoundingBoxToBrushData(brushData, props) {
    let type = brushData[0];
    let width = +props.width;
    let height = +props.height;
    if (type === LINEAR_GRADIENT) {
        brushData[1] *= width;
        brushData[2] *= height;
        brushData[3] *= width;
        brushData[4] *= height;
    } else if (type === RADIAL_GRADIENT) {
        brushData[1] *= width;
        brushData[2] *= height;
        brushData[3] *= width;
        brushData[4] *= height;
        brushData[5] *= width;
        brushData[6] *= height;
    } else if (type === PATTERN) {
        // todo
    }
}

export default function (colorOrBrush, props) {
    if (!colorOrBrush) {
        return null;
    }
    if (colorOrBrush._brush) {
        if (colorOrBrush._bb) {
            // The legacy API for Gradients allow for the bounding box to be used
            // as a convenience for specifying gradient positions. This should be
            // deprecated. It's not properly implemented in canvas mode. ReactART
            // doesn't handle update to the bounding box correctly. That's why we
            // mutate this so that if it's reused, we reuse the same resolved box.
            applyBoundingBoxToBrushData(colorOrBrush._brush, props);
            colorOrBrush._bb = false;
        }
        return colorOrBrush._brush;
    }

    let c = new Color(colorOrBrush).rgbaArray();
    return [SOLID_COLOR, c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
}

export {
    LINEAR_GRADIENT,
    RADIAL_GRADIENT
}
