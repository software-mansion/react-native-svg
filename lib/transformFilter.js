export default function (props) {
    let coords = props.origin ? props.origin.split(',') : [];

    let originX = coords.length === 2 ? coords[0] : props.originX;
    let originY = coords.length === 2 ? coords[1] :props.originY;

    return {
        rotation: props.rotation || props.rotate || 0,
        scale: props.scale || 1,
        originX,
        originY
    }
}
