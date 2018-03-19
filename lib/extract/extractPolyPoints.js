export default function(polyPoints) {
    return polyPoints
        .replace(/[^e]-/, " -")
        .split(/(?:\s+|\s*,\s*)/g)
        .join(" ");
}
