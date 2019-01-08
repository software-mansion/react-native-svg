import Matrix2D from "../Matrix2D";
import transformParser from "./transform";

const pooledMatrix = new Matrix2D();

function transformToMatrix(props, transform) {
    pooledMatrix.reset();
    appendTransform(props);

    if (transform) {
        appendTransform(transform);
    }

    return pooledMatrix.toArray();
}

function appendTransform(transform) {
    if (transform) {
        if (typeof transform === "string") {
            try {
                const [a, c, tx, b, d, ty] = transformParser.parse(transform);
                pooledMatrix.append(a, b, c, d, tx, ty);
            } catch (e) {
                console.error(e);
            }
        } else {
            pooledMatrix.appendTransform(
                transform.x + transform.originX,
                transform.y + transform.originY,
                transform.scaleX,
                transform.scaleY,
                transform.rotation,
                transform.skewX,
                transform.skewY,
                transform.originX,
                transform.originY,
            );
        }
    }
}

function universal2axis(universal, axisX, axisY, defaultValue) {
    let x;
    let y;
    if (typeof universal === "string") {
        const coords = universal.split(/\s*,\s*/);
        if (coords.length === 2) {
            x = +coords[0];
            y = +coords[1];
        } else if (coords.length === 1) {
            x = y = +coords[0];
        }
    } else if (typeof universal === "number") {
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

export function props2transform(props) {
    if (props && typeof props === "string") {
        return props;
    }
    const [originX, originY] = universal2axis(
        props.origin,
        props.originX,
        props.originY,
    );
    const [scaleX, scaleY] = universal2axis(
        props.scale,
        props.scaleX,
        props.scaleY,
        1,
    );
    const [skewX, skewY] = universal2axis(props.skew, props.skewX, props.skewY);
    const [translateX, translateY] = universal2axis(
        props.translate,
        // eslint-disable-next-line eqeqeq
        props.translateX == null ? props.x || 0 : props.translateX,
        // eslint-disable-next-line eqeqeq
        props.translateY == null ? props.y || 0 : props.translateY,
    );

    return {
        rotation: +props.rotation || 0,
        scaleX: scaleX,
        scaleY: scaleY,
        originX: originX,
        originY: originY,
        skewX: skewX,
        skewY: skewY,
        x: translateX,
        y: translateY,
    };
}

export default function extractTransform(props) {
    return transformToMatrix(
        props2transform(props),
        props.transform ? props2transform(props.transform) : null,
    );
}
