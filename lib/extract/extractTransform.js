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

const SPLIT_REGEX = /[\s*()|,]/;

class TransformParser {

    parse(transform) {
        if (transform) {
            const retval = {};
            let transLst = _.filter(
              transform.split(SPLIT_REGEX),
              (ele) => {
                return ele !== '';
              }
            );
            for (let i = 0; i < transLst.length; i++) {
                let trans = transLst[i];
                switch (trans) {
                    case 'matrix':
                        if (i + 7 <= transLst.length) {
                            retval.matrix = _.map((transLst.slice(i + 1,i + 7)), parseFloat);
                        }
                        break;
                    case 'translate':
                        retval.translateX = transLst[i + 1];
                        retval.translateY = (transLst.length === 3) ? transLst[i + 2] : 0;
                        break;
                    case 'scale':
                        retval.scaleX = transLst[i + 1];
                        retval.scaleY = (transLst.length === 3) ? transLst[i + 2] : retval.scaleX;
                        break;
                    case 'rotate':
                        retval.rotation = transLst[i + 1];
                        break;
                    case 'skewX':
                        retval.skewX = transLst[i + 1];
                        break;
                    case 'skewY':
                        retval.skewY = transLst[i + 1];
                        break;
                    default:
                        break;
                }
            }
            return retval;
        }
    }
}

export const tp = new TransformParser();


function appendTransform(transform) {
    if (transform) {
        if (typeof transform === 'string') {
            const transformParsed = tp.parse(transform);
            if (transformParsed.matrix) {
                pooledMatrix.append(...transformParsed.matrix);
            }
            else {
                let trans = props2transform(transformParsed);
                if (typeof trans !== 'string') {
                    transform = trans;
                }
            }
        }
        if (typeof transform !== 'string') {
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
    }
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

export function props2transform(props) {
    if (props && (typeof props === 'string')) {
      return props;
    }
    let [originX, originY] = universal2axis(props.origin, props.originX, props.originY);
    let [scaleX, scaleY] = universal2axis(props.scale, props.scaleX, props.scaleY, 1);
    let [skewX, skewY] = universal2axis(props.skew, props.skewX, props.skewY);
    let [translateX, translateY] = universal2axis(
        props.translate,
        _.isNil(props.translateX) ? (props.x || 0) : props.translateX,
        _.isNil(props.translateY) ? (props.y || 0) : props.translateY
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
        y: translateY
    };
}

export default function (props) {
    return transformToMatrix(props2transform(props), props.transform ? props2transform(props.transform) : null);
}
