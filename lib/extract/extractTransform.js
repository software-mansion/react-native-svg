import Matrix2D from '../Matrix2D';
import _ from 'lodash';
let pooledMatrix = new Matrix2D();
import peg from 'pegjs';

function transformToMatrix(props, transform) {
    pooledMatrix.reset();
    appendTransform(props);

    if (transform) {
        appendTransform(transform);
    }

    return pooledMatrix.toArray();
}

const transformParser = peg.generate(`
{
    var deg2rad = Math.PI / 180;

    /*
     ╔═        ═╗   ╔═        ═╗   ╔═     ═╗
     ║ al cl el ║   ║ ar cr er ║   ║ a c e ║
     ║ bl dl fl ║ * ║ br dr fr ║ = ║ b d f ║
     ║ 0  0  1  ║   ║ 0  0  1  ║   ║ 0 0 1 ║
     ╚═        ═╝   ╚═        ═╝   ╚═     ═╝
    */
    function multiply_matrices(l, r) {
        var [al, cl, el, bl, dl, fl] = l;
        var [ar, cr, er, br, dr, fr] = r;

        var a = al * ar + cl * br;
        var c = al * cr + cl * dr;
        var e = al * er + cl * fr + el;
        var b = bl * ar + dl * br;
        var d = bl * cr + dl * dr;
        var f = bl * er + dl * fr + fl;

        return [a, c, e, b, d, f];
    }
}

transformList
    = wsp* ts:transforms? wsp* { return ts; }

transforms
    = t:transform commaWsp* ts:transforms
    {
        return multiply_matrices(t, ts);
    }
    / t:transform

transform
    = matrix
    / translate
    / scale
    / rotate
    / skewX
    / skewY

matrix
    = "matrix" wsp* "(" wsp*
        a:number commaWsp
        b:number commaWsp
        c:number commaWsp
        d:number commaWsp
        e:number commaWsp
        f:number wsp* ")"
    {
        return [
            a, c, e,
            b, d, f
        ];
    }

translate
    = "translate" wsp* "(" wsp* tx:number ty:commaWspNumber? wsp* ")"
    {
        return [
            1, 0, tx,
            0, 1, ty || 0
        ];
    }

scale
    = "scale" wsp* "(" wsp* sx:number sy:commaWspNumber? wsp* ")"
    {
        return [
            sx, 0,                     0,
            0,  sy === null ? sx : sy, 0
        ];
    }

rotate
    = "rotate" wsp* "(" wsp* angle:number c:commaWspTwoNumbers? wsp* ")"
    {
        var cos = Math.cos(deg2rad * angle);
        var sin = Math.sin(deg2rad * angle);
        if (c !== null) {
            var [x, y] = c;
            return [
                cos, -sin, cos * -x + -sin * -y + x,
                sin,  cos, sin * -x +  cos * -y + y
            ];
        }
        return [
            cos, -sin, 0,
            sin,  cos, 0
        ];
    }

skewX
    = "skewX" wsp* "(" wsp* angle:number wsp* ")"
    {
        return [
            1, Math.tan(deg2rad * angle), 0,
            0, 1,                         0
        ];
    }

skewY
    = "skewY" wsp* "(" wsp* angle:number wsp* ")"
    {
        return [
            1,                         0, 0,
            Math.tan(deg2rad * angle), 1, 0
        ];
    }

number
    = f:(sign? floatingPointConstant) { return parseFloat(f.join("")); }
    / i:(sign? integerConstant) { return parseInt(i.join("")); }

commaWspNumber
    = commaWsp n:number { return n; }

commaWspTwoNumbers
    = commaWsp n1:number commaWsp n2:number { return [n1, n2]; }

commaWsp
    = (wsp+ comma? wsp*) / (comma wsp*)

comma
    = ","

integerConstant
    = ds:digitSequence { return ds.join(""); }

floatingPointConstant
    = f:(fractionalConstant exponent?) { return f.join(""); }
    / d:(digitSequence exponent) { return d.join(""); }

fractionalConstant "fractionalConstant"
    = d1:digitSequence? "." d2:digitSequence { return [d1 ? d1.join("") : null, ".", d2.join("")].join(""); }
    / d:digitSequence "." { return d.join(""); }

exponent
    =  e:([eE] sign? digitSequence) { return [e[0], e[1], e[2].join("")].join(""); }

sign
    = [+-]

digitSequence
    = digit+

digit
    = [0-9]

wsp
    = [\\u0020\\u0009\\u000D\\u000A]
`);

function appendTransform(transform) {
    if (transform) {
        if (typeof transform === 'string') {
            try {
                const [a, c, e, b, d, f] = transformParser.parse(transform);
                pooledMatrix.append(...[a, b, c, d, e, f]);
            } catch (e) {
                console.error(e);
            }
        } else {
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
