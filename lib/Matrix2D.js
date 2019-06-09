/**
 * based on
 * https://github.com/CreateJS/EaselJS/blob/631cdffb85eff9413dab43b4676f059b4232d291/src/easeljs/geom/Matrix2D.js
 */
const DEG_TO_RAD = Math.PI / 180;

export const identity = [1, 0, 0, 1, 0, 0];

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
  constructor() {
    this.reset();

    // public properties:
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
   * Reset current matrix to an identity matrix.
   * @method reset
   **/
  reset = function() {
    if (this.hasInitialState) {
      return;
    }
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    this.hasInitialState = true;
  };

  /**
   * Returns an array with current matrix values.
   * @method toArray
   * @return {Array} an array with current matrix values.
   **/
  toArray = function() {
    if (this.hasInitialState) {
      return identity;
    }
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
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
   **/
  append = function(a, b, c, d, tx, ty) {
    if (this.hasInitialState) {
      this.hasInitialState = false;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
      return;
    }
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
      this.a = a1 * a + c1 * b;
      this.b = b1 * a + d1 * b;
      this.c = a1 * c + c1 * d;
      this.d = b1 * c + d1 * d;
    }
    this.tx = a1 * tx + c1 * ty + this.tx;
    this.ty = b1 * tx + d1 * ty + this.ty;
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
   **/
  appendTransform = function(
    x,
    y,
    scaleX,
    scaleY,
    rotation,
    skewX,
    skewY,
    regX,
    regY,
  ) {
    if (
      x === 0 &&
      y === 0 &&
      scaleX === 1 &&
      scaleY === 1 &&
      rotation === 0 &&
      skewX === 0 &&
      skewY === 0 &&
      regX === 0 &&
      regY === 0
    ) {
      return;
    }
    let cos, sin;
    if (rotation % 360) {
      const r = rotation * DEG_TO_RAD;
      cos = Math.cos(r);
      sin = Math.sin(r);
    } else {
      cos = 1;
      sin = 0;
    }

    const a = cos * scaleX;
    const b = sin * scaleX;
    const c = -sin * scaleY;
    const d = cos * scaleY;

    if (skewX || skewY) {
      const b1 = Math.tan(skewY * DEG_TO_RAD);
      const c1 = Math.tan(skewX * DEG_TO_RAD);
      this.append(a + c1 * b, b1 * a + b, c + c1 * d, b1 * c + d, x, y);
    } else {
      this.append(a, b, c, d, x, y);
    }

    if (regX || regY) {
      // append the registration offset:
      this.tx -= regX * this.a + regY * this.c;
      this.ty -= regX * this.b + regY * this.d;
      this.hasInitialState = false;
    }
  };
}
