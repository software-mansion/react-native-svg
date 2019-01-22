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
                const t = transformParser.parse(transform);
                pooledMatrix.append(t[0], t[3], t[1], t[4], t[2], t[5]);
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
    const origin = universal2axis(
        props.origin,
        props.originX,
        props.originY,
    );
    const scale = universal2axis(
        props.scale,
        props.scaleX,
        props.scaleY,
        1,
    );
    const skew = universal2axis(props.skew, props.skewX, props.skewY);
    const translate = universal2axis(
        props.translate,
        // eslint-disable-next-line eqeqeq
        props.translateX == null ? props.x || 0 : props.translateX,
        // eslint-disable-next-line eqeqeq
        props.translateY == null ? props.y || 0 : props.translateY,
    );

    return {
        rotation: +props.rotation || 0,
        scaleX: scale[0],
        scaleY: scale[1],
        originX: origin[0],
        originY: origin[1],
        skewX: skew[0],
        skewY: skew[1],
        x: translate[0],
        y: translate[1],
    };
}

export default function extractTransform(props) {
    return transformToMatrix(
        props2transform(props),
        props.transform ? props2transform(props.transform) : null,
    );
}
