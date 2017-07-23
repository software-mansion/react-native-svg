/**
 * based on
 * https://github.com/CreateJS/EaselJS/blob/631cdffb85eff9413dab43b4676f059b4232d291/src/easeljs/geom/Matrix2D.js
 */
const DEG_TO_RAD = Math.PI / 180;

/**
 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
 *
 * This matrix can be visualized as:
 *
 * 	[ a  c  tx
 * 	  b  d  ty
 * 	  0  0  1  ]
 *
 * Note the locations of b and c.
 *
 * @class Matrix2D
 * @param {Number} [a=1] Specifies the a property for the new matrix.
 * @param {Number} [b=0] Specifies the b property for the new matrix.
 * @param {Number} [c=0] Specifies the c property for the new matrix.
 * @param {Number} [d=1] Specifies the d property for the new matrix.
 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
 * @constructor
 **/
export default class Matrix2D {
    constructor(a, b, c, d, tx, ty) {
        this.setTransform(a, b, c, d, tx, ty);

        // public properties:
        // assigned in the setValues method.
        /**
         * Position (0, 0) in a 3x3 affine transformation matrix.
         * @property a
         * @type Number
         **/

        /**
         * Position (0, 1) in a 3x3 affine transformation matrix.
         * @property b
         * @type Number
         **/

        /**
         * Position (1, 0) in a 3x3 affine transformation matrix.
         * @property c
         * @type Number
         **/

        /**
         * Position (1, 1) in a 3x3 affine transformation matrix.
         * @property d
         * @type Number
         **/

        /**
         * Position (2, 0) in a 3x3 affine transformation matrix.
         * @property tx
         * @type Number
         **/

        /**
         * Position (2, 1) in a 3x3 affine transformation matrix.
         * @property ty
         * @type Number
         **/
    }

    /**
     * Set current matrix to new absolute matrix.
     * @method setTransform
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @return {Matrix2D} This instance. Useful for chaining method calls.
     */
    setTransform = function(a, b, c, d, tx, ty) {
        this.a = a === null || a === undefined ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d === null || d === undefined ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        //noinspection JSValidateTypes
        return this;
    };

    /**
     * Reset current matrix to an identity matrix.
     * @method reset
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    reset = function() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        //noinspection JSValidateTypes
        return this;
    };

    /**
     * Returns an array with current matrix values.
     * @method toArray
     * @return {Array} an array with current matrix values.
     **/
    toArray = function() {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Copies all properties from the specified matrix to this matrix.
     * @method copy
     * @param {Matrix2D} matrix The matrix to copy properties from.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    copy = function(matrix) {
        //noinspection JSUnresolvedVariable
        return this.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Clones current instance and returning a new matrix.
     * @method clone
     * @return {Matrix2D} a clone of the Matrix2D instance.
     **/
    clone = function() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };

    /**
     * Prepends the specified matrix properties to this matrix.
     * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
     * All parameters are required.
     * @method prepend
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    prepend = function(a, b, c, d, tx, ty) {
        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;

        this.a  = a * a1 + c * this.b;
        this.b  = b * a1 + d * this.b;
        this.c  = a * c1 + c * this.d;
        this.d  = b * c1 + d * this.d;
        this.tx = a * tx1 + c * this.ty + tx;
        this.ty = b * tx1 + d * this.ty + ty;
        //noinspection JSValidateTypes
        return this;
    };

    /**
     * Appends the specified matrix properties to this matrix. All parameters are required.
     * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
     * @method append
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    append = function(a, b, c, d, tx, ty) {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
            this.a  = a1 * a + c1 * b;
            this.b  = b1 * a + d1 * b;
            this.c  = a1 * c + c1 * d;
            this.d  = b1 * c + d1 * d;
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        //noinspection JSValidateTypes
        return this;
    };

    /**
     * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
     * For example, you can use this to generate a matrix representing the transformations of a display object:
     *
     * 	var mtx = new createjs.Matrix2D();
     * 	mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method appendTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        let cos, sin;
        if (rotation % 360) {
            const r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (skewX || skewY) {
            // TODO: can this be combined into a single append operation?
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }

        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        //noinspection JSValidateTypes
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
     * For example, you could calculate the combined transformation for a child object using:
     *
     * 	var o = myDisplayObject;
     * 	var mtx = new createjs.Matrix2D();
     * 	do  {
	 * 		// prepend each parent's transformation in turn:
	 * 		mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	 * 	} while (o = o.parent);
     *
     * 	Note that the above example would not account for {{#crossLink "DisplayObject/transformMatrix:property"}}{{/crossLink}}
     * 	values. See {{#crossLink "Matrix2D/prependMatrix"}}{{/crossLink}} for an example that does.
     * @method prependTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        let cos, sin;
        if (rotation % 360) {
            const r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX; this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        //noinspection JSValidateTypes
        return this;
    };
}
