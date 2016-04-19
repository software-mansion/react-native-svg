import Color from 'color';

function insertColorIntoArray(color, targetArray, atIndex) {
    var c = new Color(color).rgbaArray();
    targetArray[atIndex + 0] = c[0] / 255;
    targetArray[atIndex + 1] = c[1] / 255;
    targetArray[atIndex + 2] = c[2] / 255;
    targetArray[atIndex + 3] = c[3];
}

function insertColorsIntoArray(stops, targetArray, atIndex) {
    var i = 0;
    if ('length' in stops) {
        while (i < stops.length) {
            insertColorIntoArray(stops[i], targetArray, atIndex + i * 4);
            i++;
        }
    } else {
        for (var offset in stops) {
            insertColorIntoArray(stops[offset], targetArray, atIndex + i * 4);
            i++;
        }
    }
    return atIndex + i * 4;
}

function insertColorStopsIntoArray(stops, targetArray, atIndex) {
    var lastIndex = insertColorsIntoArray(stops, targetArray, atIndex);
    insertOffsetsIntoArray(stops, targetArray, lastIndex, 1, false);
}

function insertOffsetsIntoArray(stops, targetArray, atIndex, multi, reverse) {
    var offsetNumber;
    var i = 0;
    if ('length' in stops) {
        while (i < stops.length) {
            offsetNumber = i / (stops.length - 1) * multi;
            targetArray[atIndex + i] = reverse ? 1 - offsetNumber : offsetNumber;
            i++;
        }
    } else {
        for (var offsetString in stops) {
            offsetNumber = (+offsetString) * multi;
            targetArray[atIndex + i] = reverse ? 1 - offsetNumber : offsetNumber;
            i++;
        }
    }
    return atIndex + i;
}

function insertDoubleColorStopsIntoArray(stops, targetArray, atIndex) {
    var lastIndex = insertColorsIntoArray(stops, targetArray, atIndex);
    lastIndex = insertColorsIntoArray(stops, targetArray, lastIndex);
    lastIndex = insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, false);
    insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, true);
}

export {
    insertDoubleColorStopsIntoArray,
    insertColorStopsIntoArray
}
