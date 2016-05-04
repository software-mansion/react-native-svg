import Transform from '../Transform';
import _ from 'lodash';
let pooledTransform = new Transform();

function transformToMatrix(props) {
    let scaleX = !_.isNil(props.scaleX) ? props.scaleX :
        !_.isNil(props.scale) ? props.scale : 1;
    let scaleY = !_.isNil(props.scaleY) ? props.scaleY :
        !_.isNil(props.scale) ? props.scale : 1;

    pooledTransform
        .transformTo(1, 0, 0, 1, 0, 0)
        .move(props.x || 0, props.y || 0)
        .rotate(props.rotation || 0, props.originX, props.originY)
        .scale(scaleX, scaleY, props.originX, props.originY);

    if (!_.isNil(props.transform)) {
        pooledTransform.transform(props.transform);
    }

    return [
        pooledTransform.xx, pooledTransform.yx,
        pooledTransform.xy, pooledTransform.yy,
        pooledTransform.x,  pooledTransform.y
    ];
}


export default function (props) {
    let coords = props.origin ? props.origin.split(/\s*,\s*/) : [];

    // TODO: support Percentage for originX,originY
    let originX = coords.length === 2 ? coords[0] : props.originX;
    let originY = coords.length === 2 ? coords[1] : props.originY;
    return transformToMatrix({
        rotation: +props.rotation / 2 || +props.rotate / 2 || 0,
        scale: props.scale,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        originX: +originX || 0,
        originY: +originY || 0,
        x: +props.x || 0,
        y: +props.y || 0
    });
}
