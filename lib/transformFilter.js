export default function (props) {
    let coords = props.origin ? props.origin.split(/\s*,\s*/) : [];

    // TODO: support Percentage for originX,originY
    let originX = coords.length === 2 ? coords[0] : props.originX;
    let originY = coords.length === 2 ? coords[1] : props.originY;
    let scale = props.scale == 0 ? 0 : props.scale;
    return {
        rotation: +props.rotation / 2 || +props.rotate / 2 || 0,
        scale: isNaN(scale) ? 1 : scale,
        originX: +originX || 0,
        originY: +originY || 0,
        x: +props.x || 0,
        y: +props.y || 0
    }
}
