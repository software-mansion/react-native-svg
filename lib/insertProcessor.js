import Color from 'color';
import _ from 'lodash';

function insertColorIntoArray(color, targetArray, atIndex) {
    var c = new Color(color).rgbaArray();
    targetArray[atIndex + 0] = c[0] / 255;
    targetArray[atIndex + 1] = c[1] / 255;
    targetArray[atIndex + 2] = c[2] / 255;
    targetArray[atIndex + 3] = c[3];
}

function insertColorsIntoArray(stops, targetArray, atIndex, reverse) {
    let i = 0;

    if ('length' in stops) {
        while (i < stops.length) {
            insertColorIntoArray(stops[i], targetArray, atIndex + i * 4);
            i++;
        }
    } else {
        let sorted = _.sortBy(_.map(stops, (value, key) => ({key, value})), 'key');
        if (reverse) {
            sorted.reverse();
        }

        sorted.forEach(({value:stop}) => {
            insertColorIntoArray(stop, targetArray, atIndex + i * 4);
            i++;
        });
    }
    return atIndex + i * 4;
}

function insertColorStopsIntoArray(stops, targetArray, atIndex) {
    let lastIndex = insertColorsIntoArray(stops, targetArray, atIndex, false);
    insertOffsetsIntoArray(stops, targetArray, lastIndex, 1, false);
}

function insertOffsetsIntoArray(stops, targetArray, atIndex, multi, reverse) {
    let offsetNumber;
    let i = 0;
    let arr = [];
    if ('length' in stops) {
        while (i < stops.length) {
            offsetNumber = i / (stops.length - 1) * multi;
            targetArray[atIndex + i] = reverse ? 1 - offsetNumber : offsetNumber;
            i++;
        }
    } else {
        _.forEach(stops, (stop, offsetString) => {
            offsetNumber = (+offsetString) * multi;
            arr.push(reverse ? 1 - offsetNumber : offsetNumber);
            i++;
        });
        arr.sort();
        targetArray.splice(atIndex, 0, ...arr);
    }
    return atIndex + i;
}

function insertDoubleColorStopsIntoArray(stops, targetArray, atIndex) {
    let lastIndex = insertColorsIntoArray(stops, targetArray, atIndex, false);
    lastIndex = insertColorsIntoArray(stops, targetArray, lastIndex, true);
    lastIndex = insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, false);
    insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, true);
}

export {
    insertDoubleColorStopsIntoArray,
    insertColorStopsIntoArray
}
