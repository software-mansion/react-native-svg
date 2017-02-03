import Matrix2D from '../Matrix2D';
import _ from 'lodash';
let pooledMatrix = new Matrix2D();

function transformToMatrix(props, transform) {
    pooledMatrix.reset();
    appendTransform(props);

    if (transform) {
        appendTransform(transform);
    }

    return pooledMatrix.toArray();
}

function appendTransform(transform) {
    pooledMatrix
        .appendTransform(
            transform.x + transform.originX,
            transform.y + transform.originY,
            transform.scaleX, transform.scaleY,
            transform.rotation,
            transform.skewX,
            transform.skewY,
            transform.originX,
            transform.originY
        );
}

function universal2axis(universal, axisX, axisY, defaultValue) {
    let coords = [];
    let x;
    let y;
    if (_.isString(universal)) {
        coords = universal.split(/\s*,\s*/);
        if (coords.length === 2) {
            x = +coords[0];
            y = +coords[1];
        } else if　(coords.length === 1)　{
            x = y = +coords[0];
        }
    } else if (_.isNumber(universal)) {
        x = y = universal;
    }

    axisX = +axisX;
    if (!isNaN(axisX)) {
        x = axisX;
    }

    axisY = +axisY;
    if (!isNaN(axisY)) {
        y = axisY;
    }

    return [x || defaultValue || 0, y || defaultValue || 0];
}

function props2transform(props) {
    let [originX, originY] = universal2axis(props.origin, props.originX, props.originY);
    let [scaleX, scaleY] = universal2axis(props.scale, props.scaleX, props.scaleY, 1);
    let [skewX, skewY] = universal2axis(props.skew, props.skewX, props.skewY);
    let [translateX, translateY] = universal2axis(
        props.translate,
        _.isNil(props.translateX) ? props.x : props.translateX,
        _.isNil(props.translateY) ? props.y : props.translateY
    );

    return {
        rotation: +props.rotation || +props.rotate || 0,
        scaleX: scaleX,
        scaleY: scaleY,
        originX: originX,
        originY: originY,
        skewX: skewX,
        skewY: skewY,
        x: translateX,
        y: translateY
    };
}

export default function (props) {
    return transformToMatrix(props2transform(props), props.transform ? props2transform(props.transform) : null);
}
