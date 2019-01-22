import Color from "color";

const urlIdPattern = /^url\(#(.+?)\)$/;

export default function extractBrush(colorOrBrush) {
    if (colorOrBrush === "none" || !colorOrBrush) {
        return null;
    }

    if (colorOrBrush === "currentColor") {
        return [2];
    }
    try {
        const matched = colorOrBrush.match(urlIdPattern);
        // brush
        if (matched) {
            return [1, matched[1]];
        } else {
            // solid color
            const color = Color(colorOrBrush)
                .rgb()
                .array();
            const r = color[0] / 255;
            const g = color[1] / 255;
            const b = color[2] / 255;
            const a = color[3];
            return [0, r, g, b, a === undefined ? 1 : a];
        }
    } catch (err) {
        console.warn(`"${colorOrBrush}" is not a valid color or brush`);
        return null;
    }
}
