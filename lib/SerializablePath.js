import _ from 'lodash';
const MOVE_TO = 0;
const CLOSE = 1;
const LINE_TO = 2;
const CURVE_TO = 3;

export default class SerializablePath {
    constructor(path) {
        this.reset();
        if (path instanceof SerializablePath) {
            this.path = path.path.slice();
        } else if (path) {
            this.push(path);
        }
    }

    /* parser */
    push = () => {
        let p = Array.prototype.join.call(arguments, ' ')
            .replace(/(\.\d+)(?=\-?\.)/ig, '$1,') //-.3-.575 => -.3,-.575
            .match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/ig);

        if (!p) {
            return this;
        }

        let last,
            cmd = p[0],
            i = 1;

        while (cmd){
            switch (cmd){
                case 'm': this.move(p[i++], p[i++]); break;
                case 'l': this.line(p[i++], p[i++]); break;
                case 'c': this.curve(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]); break;
                case 's': this.curve(p[i++], p[i++], null, null, p[i++], p[i++]); break;
                case 'q': this.curve(p[i++], p[i++], p[i++], p[i++]); break;
                case 't': this.curve(p[i++], p[i++]); break;
                case 'a': this.arc(p[i + 5], p[i + 6], p[i], p[i + 1], p[i + 3], !+p[i + 4], +p[i + 2]); i += 7; break;
                case 'h': this.line(p[i++], 0); break;
                case 'v': this.line(0, p[i++]); break;

                case 'M': this.moveTo(p[i++], p[i++]); break;
                case 'L': this.lineTo(p[i++], p[i++]); break;
                case 'C': this.curveTo(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]); break;
                case 'S': this.curveTo(p[i++], p[i++], null, null, p[i++], p[i++]); break;
                case 'Q': this.curveTo(p[i++], p[i++], p[i++], p[i++]); break;
                case 'T': this.curveTo(p[i++], p[i++]); break;
                case 'A': this.arcTo(p[i + 5], p[i + 6], p[i], p[i + 1], p[i + 3], !+p[i + 4], +p[i + 2]); i += 7; break;
                case 'H': this.lineTo(p[i++], this.penY); break;
                case 'V': this.lineTo(this.penX, p[i++]); break;

                case 'Z': case 'z': this.close(); break;
                default:
                    cmd = last;
                    i--;
                    continue;
            }

            last = cmd;
            if (last === 'm') {
                last = 'l';
            }
            else if (last === 'M') {
                last = 'L';
            }
            cmd = p[i++];
        }
        return this;
    };

    /* utility methods */

    reset = () => {
        this.penX = this.penY = 0;
        this.penDownX = this.penDownY = null;
        this._pivotX = this._pivotY = 0;
        this.onReset();
        return this;
    };

    move = (x,y) => {
        this.onMove(this.penX, this.penY, this._pivotX = this.penX += (+x), this._pivotY = this.penY += (+y));
        return this;
    };

    moveTo = (x,y) => {
        this.onMove(this.penX, this.penY, this._pivotX = this.penX = (+x), this._pivotY = this.penY = (+y));
        return this;
    };

    line = (x,y) => {
        return this.lineTo(this.penX + (+x), this.penY + (+y));
    };

    lineTo = (x,y) => {
        if (_.isNil(this.penDownX)) {
            this.penDownX = this.penX; this.penDownY = this.penY;
        }
        this.onLine(this.penX, this.penY, this._pivotX = this.penX = (+x), this._pivotY = this.penY = (+y));
        return this;
    };

    curve = (c1x, c1y, c2x, c2y, ex, ey) => {
        let x = this.penX,
            y = this.penY;

        return this.curveTo(
            x + (+c1x), y + (+c1y),
            _.isNil(c2x) ? null : x + (+c2x),
            _.isNil(c2y) ? null : y + (+c2y),
            _.isNil(ex) ? null : x + (+ex),
            _.isNil(ey) ? null : y + (+ey)
        );
    };

    curveTo = (c1x, c1y, c2x, c2y, ex, ey) => {
        let x = this.penX,
            y = this.penY;

        if (_.isNil(c2x)){
            c2x = +c1x; c2y = +c1y;
            c1x = (x * 2) - (this._pivotX || 0); c1y = (y * 2) - (this._pivotY || 0);
        }

        if (_.isNil(ex)){
            this._pivotX = +c1x; this._pivotY = +c1y;
            ex = +c2x; ey = +c2y;
            c2x = (ex + (+c1x) * 2) / 3; c2y = (ey + (+c1y) * 2) / 3;
            c1x = (x + (+c1x) * 2) / 3; c1y = (y + (+c1y) * 2) / 3;
        } else {
            this._pivotX = +c2x; this._pivotY = +c2y;
        }
        if (_.isNil(this.penDownX)) {
            this.penDownX = x; this.penDownY = y;
        }
        this.onBezierCurve(x, y, +c1x, +c1y, +c2x, +c2y, this.penX = +ex, this.penY = +ey);
        return this;
    };

    arc = (x, y, rx, ry, outer, counterClockwise, rotation) => {
        return this.arcTo(this.penX + (+x), this.penY + (+y), rx, ry, outer, counterClockwise, rotation);
    };

    arcTo = (x, y, rx, ry, outer, counterClockwise, rotation) => {
        ry = Math.abs(+ry || +rx || (+y - this.penY));
        rx = Math.abs(+rx || (+x - this.penX));

        if (!rx || !ry || (x === this.penX && y === this.penY)) {
            return this.lineTo(x, y);
        }

        let tX = this.penX, tY = this.penY, clockwise = !+counterClockwise, large = !!+outer;

        let rad = rotation ? rotation * Math.PI / 180 : 0, cos = Math.cos(rad), sin = Math.sin(rad);
        x -= tX; y -= tY;

        // Ellipse Center
        let cx = cos * x / 2 + sin * y / 2,
            cy = -sin * x / 2 + cos * y / 2,
            rxry = rx * rx * ry * ry,
            rycx = ry * ry * cx * cx,
            rxcy = rx * rx * cy * cy,
            a = rxry - rxcy - rycx;

        if (a < 0){
            a = Math.sqrt(1 - a / rxry);
            rx *= a; ry *= a;
            cx = x / 2; cy = y / 2;
        } else {
            a = Math.sqrt(a / (rxcy + rycx));

            if (large === clockwise) {
                a = -a;
            }
            let cxd = -a * cy * rx / ry,
                cyd =  a * cx * ry / rx;
            cx = cos * cxd - sin * cyd + x / 2;
            cy = sin * cxd + cos * cyd + y / 2;
        }

        // Rotation + Scale Transform
        let xx =  cos / rx, yx = sin / rx,
            xy = -sin / ry, yy = cos / ry;

        // Start and End Angle
        let sa = Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy),
            ea = Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

        cx += tX; cy += tY;
        x += tX; y += tY;

        // Circular Arc
        if (_.isNil(this.penDownX)) {
            this.penDownX = this.penX; this.penDownY = this.penY;
        }
        this.onArc(
            tX, tY, this._pivotX = this.penX = x, this._pivotY = this.penY = y,
            cx, cy, rx, ry, sa, ea, !clockwise, rotation
        );
        return this;
    };

    counterArc = (x, y, rx, ry, outer) =>{
        return this.arc(x, y, rx, ry, outer, true);
    };

    counterArcTo = (x, y, rx, ry, outer) => {
        return this.arcTo(x, y, rx, ry, outer, true);
    };

    close = () => {
        if (!_.isNil(this.penDownX)){
            this.onClose(this.penX, this.penY, this.penX = this.penDownX, this.penY = this.penDownY);
            this.penDownX = null;
        }
        return this;
    };

    /* overridable handlers */

    onReset = () => {
        this.path = [];
    };

    onMove = (sx, sy, x, y) => {
        this.path.push(MOVE_TO, x, y);
    };

    onLine = (sx, sy, x, y) => {
        this.path.push(LINE_TO, x, y);
    };

    onBezierCurve = (sx, sy, p1x, p1y, p2x, p2y, x, y) => {
        this.path.push(CURVE_TO, p1x, p1y, p2x, p2y, x, y);
    };

    _arcToBezier = (sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) => {
        // Inverse Rotation + Scale Transform
        let rad = rotation ? rotation * Math.PI / 180 : 0,
            cos = Math.cos(rad), sin = Math.sin(rad),
            xx = cos * rx, yx = -sin * ry,
            xy = sin * rx, yy =  cos * ry;

        // Bezier Curve Approximation
        let arc = ea - sa;
        if (arc < 0 && !ccw) {
            arc += Math.PI * 2;
        } else if (arc > 0 && ccw) {
            arc -= Math.PI * 2;
        }

        let n = Math.ceil(Math.abs(arc / (Math.PI / 2))),
            step = arc / n,
            k = (4 / 3) * Math.tan(step / 4);

        let x = Math.cos(sa), y = Math.sin(sa);

        for (let i = 0; i < n; i++){
            let cp1x = x - k * y, cp1y = y + k * x;

            sa += step;
            x = Math.cos(sa); y = Math.sin(sa);

            let cp2x = x + k * y, cp2y = y - k * x;

            this.onBezierCurve(
                sx, sy,
                cx + xx * cp1x + yx * cp1y, cy + xy * cp1x + yy * cp1y,
                cx + xx * cp2x + yx * cp2y, cy + xy * cp2x + yy * cp2y,
                (sx = (cx + xx * x + yx * y)), (sy = (cy + xy * x + yy * y))
            );
        }
    };

    onArc = (sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation) => {
        return this._arcToBezier(
            sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation
        );
    };

    onClose = () => {
        this.path.push(CLOSE);
    };

    toJSON = () => {
        return this.path;
    };
}
