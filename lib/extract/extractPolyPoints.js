
export default function (polyPoints) {
    return polyPoints.split(/(?:\s+|\s*,\s*)/g).join(' ');
}
