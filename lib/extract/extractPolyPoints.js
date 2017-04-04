
export default function (polyPoints) {
    return polyPoints.replace(/-/, ' -').split(/(?:\s+|\s*,\s*)/g).join(' ');
}
