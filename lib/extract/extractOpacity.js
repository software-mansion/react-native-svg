export default function(opacity) {
    const value = +opacity;
    return typeof value !== "number" || isNaN(value) ? 1 : value;
}
