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
            const [r, g, b, a = 1] = Color(colorOrBrush)
                .rgb()
                .array();
            return [0, r / 255, g / 255, b / 255, a];
        }
    } catch (err) {
        console.warn(`"${colorOrBrush}" is not a valid color or brush`);
        return null;
    }
}
