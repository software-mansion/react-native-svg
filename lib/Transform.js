import _ from 'lodash';
export default class {
    constructor(xx, yx, xy, yy, x, y){
        if (xx && typeof xx === 'object'){
            yx = xx.yx; yy = xx.yy; y = xx.y;
            xy = xx.xy; x = xx.x; xx = xx.xx;
        }
        this.xx = _.isNil(xx) ? 1 : xx;
        this.yx = yx || 0;
        this.xy = xy || 0;
        this.yy = _.isNil(yy) ? 1 : yy;
        this.x = (_.isNil(x) ? this.x : x) || 0;
        this.y = (_.isNil(y) ? this.y : y) || 0;
        return this;
    }

    xx = 1;
    yx = 0;
    x = 0;
    xy = 0;
    yy = 1;
    y = 0;

    transform = (xx, yx, xy, yy, x, y) => {
        if (xx && typeof xx === 'object'){
            yx = xx.yx; yy = xx.yy; y = xx.y;
            xy = xx.xy; x = xx.x; xx = xx.xx;
        }

        if (!x) {
            x = 0;
        }

        if (!y) {
            y = 0;
        }
        return this.transformTo(
            this.xx * xx + this.xy * yx,
            this.yx * xx + this.yy * yx,
            this.xx * xy + this.xy * yy,
            this.yx * xy + this.yy * yy,
            this.xx * x + this.xy * y + this.x,
            this.yx * x + this.yy * y + this.y
        );
    };

    transformTo = this.constructor;

    translate = (x, y) => {
        return this.transform(1, 0, 0, 1, x, y);
    };

    move = (x, y) => {
        this.x += x || 0;
        this.y += y || 0;
        return this;
    };

    scale = (x, y) => {
        return this.transform(x, 0, 0, _.isNil(y) ? x : y, 0, 0);
    };

    rotate = (deg, x, y) => {
        if (_.isNil(x) || _.isNil(y)){
            x = (this.left || 0) + (this.width || 0) / 2;
            y = (this.top || 0) + (this.height || 0) / 2;
        }

        var rad = deg * Math.PI / 180, sin = Math.sin(rad), cos = Math.cos(rad);

        this.transform(1, 0, 0, 1, x, y);

        return this.transformTo(
            cos * this.xx - sin * this.yx,
            sin * this.xx + cos * this.yx,
            cos * this.xy - sin * this.yy,
            sin * this.xy + cos * this.yy,
            this.x,
            this.y
        ).transform(1, 0, 0, 1, -x, -y);
    };

    moveTo = (x, y) => {
        return this.transformTo(this.xx, this.yx, this.xy, this.yy, x, y);
    };

    rotateTo = (deg, x, y) => {
        let flip = this.yx / this.xx > this.yy / this.xy ? -1 : 1;
        if (this.xx < 0 ? this.xy >= 0 : this.xy < 0) {
            flip = -flip;
        }
        return this.rotate(deg - Math.atan2(flip * this.yx, flip * this.xx) * 180 / Math.PI, x, y);
    };

    scaleTo = (x, y) => {
        // Normalize
        var h = Math.sqrt(this.xx * this.xx + this.yx * this.yx);
        this.xx /= h;
        this.yx /= h;

        h = Math.sqrt(this.yy * this.yy + this.xy * this.xy);
        this.yy /= h;
        this.xy /= h;

        return this.scale(x, y);
    };

    resizeTo = (width, height) => {
        var w = this.width, h = this.height;
        if (!w || !h) {
            return this;
        }
        return this.scaleTo(width / w, height / h);
    };

    inversePoint = (x, y) => {
        var a = this.xx, b = this.yx,
            c = this.xy, d = this.yy,
            e = this.x, f = this.y;
        var det = b * c - a * d;
        if (det === 0) {
            return null;
        }
        return {
            x: (d * (e - x) + c * (y - f)) / det,
            y: (a * (f - y) + b * (x - e)) / det
        };
    };

    point = (x, y) => {
        return {
            x: this.xx * x + this.xy * y + this.x,
            y: this.yx * x + this.yy * y + this.y
        };
    };
}

