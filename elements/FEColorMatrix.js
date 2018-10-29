import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEColorMatrixElement

interface SVGFEColorMatrixElement : SVGElement,
                                    SVGFilterPrimitiveStandardAttributes {

  // Color Matrix Types
  const unsigned short SVG_FECOLORMATRIX_TYPE_UNKNOWN = 0;
  const unsigned short SVG_FECOLORMATRIX_TYPE_MATRIX = 1;
  const unsigned short SVG_FECOLORMATRIX_TYPE_SATURATE = 2;
  const unsigned short SVG_FECOLORMATRIX_TYPE_HUEROTATE = 3;
  const unsigned short SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA = 4;

  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedEnumeration type;
  readonly attribute SVGAnimatedNumberList values;
};

Constants in group “Color Matrix Types”:

    SVG_FECOLORMATRIX_TYPE_UNKNOWN (unsigned short)
    The type is not one of predefined types. It is invalid to attempt to define a new value of this type or to attempt
    to switch an existing value to this type.

    SVG_FECOLORMATRIX_TYPE_MATRIX (unsigned short)
    Corresponds to value 'matrix'.

    SVG_FECOLORMATRIX_TYPE_SATURATE (unsigned short)
    Corresponds to value 'saturate'.

    SVG_FECOLORMATRIX_TYPE_HUEROTATE (unsigned short)
    Corresponds to value 'hueRotate'.

    SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA (unsigned short)
    Corresponds to value 'luminanceToAlpha'.

Attributes:

    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feColorMatrix’ element.

    type (readonly SVGAnimatedEnumeration)
    Corresponds to attribute ‘type’ on the given ‘feColorMatrix’ element.
    Takes one of the SVG_FECOLORMATRIX_TYPE_* constants defined on this interface.

    values (readonly SVGAnimatedNumberList)
    Corresponds to attribute ‘values’ on the given ‘feColorMatrix’ element.

https://www.w3.org/TR/SVG11/filters.html#feColorMatrixElement

‘feColorMatrix’

Categories:
    Filter primitive element

Content model:
    Any number of the following elements, in any order:
    ‘animate’
    ‘set’

Attributes:
    core attributes
    presentation attributes
    filter primitive attributes
    ‘class’
    ‘style’
    ‘in’
    ‘type’
    ‘values’

DOM Interfaces:
    SVGFEColorMatrixElement

Attribute definitions:

    type = "matrix | saturate | hueRotate | luminanceToAlpha"

    Indicates the type of matrix operation. The keyword 'matrix' indicates that a full 5x4 matrix of values will be
    provided. The other keywords represent convenience shortcuts to allow commonly used color operations to be performed
    without specifying a complete matrix. If attribute ‘type’ is not specified, then the effect is as if a value of
    matrix were specified.
    Animatable: yes.

    values = "list of <number>s"

    The contents of ‘values’ depends on the value of attribute ‘type’:

    For type="matrix", ‘values’ is a list of 20 matrix values (a00 a01 a02 a03 a04 a10 a11 ... a34), separated by
    whitespace and/or a comma. For example, the identity matrix could be expressed as:

        type="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"

    For type="saturate", ‘values’ is a single real number value (0 to 1). A saturate operation is equivalent to the
    following matrix operation:

        | R' |     |0.213+0.787s  0.715-0.715s  0.072-0.072s 0  0 |   | R |
        | G' |     |0.213-0.213s  0.715+0.285s  0.072-0.072s 0  0 |   | G |
        | B' |  =  |0.213-0.213s  0.715-0.715s  0.072+0.928s 0  0 | * | B |
        | A' |     |           0            0             0  1  0 |   | A |
        | 1  |     |           0            0             0  0  1 |   | 1 |

    For type="hueRotate", ‘values’ is a single one real number value (degrees). A hueRotate operation is equivalent to
    the following matrix operation:

        | R' |     | a00  a01  a02  0  0 |   | R |
        | G' |     | a10  a11  a12  0  0 |   | G |
        | B' |  =  | a20  a21  a22  0  0 | * | B |
        | A' |     | 0    0    0    1  0 |   | A |
        | 1  |     | 0    0    0    0  1 |   | 1 |

    where the terms a00, a01, etc. are calculated as follows:

        | a00 a01 a02 |    [+0.213 +0.715 +0.072]
        | a10 a11 a12 | =  [+0.213 +0.715 +0.072] +
        | a20 a21 a22 |    [+0.213 +0.715 +0.072]

                                [+0.787 -0.715 -0.072]
        cos(hueRotate value) *  [-0.213 +0.285 -0.072] +
                                [-0.213 -0.715 +0.928]

                                [-0.213 -0.715+0.928]
        sin(hueRotate value) *  [+0.143 +0.140-0.283]
                                [-0.787 +0.715+0.072]

    Thus, the upper left term of the hue matrix turns out to be:
    .213 + cos(hueRotate value)*.787 - sin(hueRotate value)*.213
    For type="luminanceToAlpha", ‘values’ is not applicable. A luminanceToAlpha operation is equivalent to the
    following matrix operation:

       | R' |     |      0        0        0  0  0 |   | R |
       | G' |     |      0        0        0  0  0 |   | G |
       | B' |  =  |      0        0        0  0  0 | * | B |
       | A' |     | 0.2125   0.7154   0.0721  0  0 |   | A |
       | 1  |     |      0        0        0  0  1 |   | 1 |

    If the attribute is not specified, then the default behavior depends on the value of attribute ‘type’.
     If type="matrix", then this attribute defaults to the identity matrix.
     If type="saturate", then this attribute defaults to the value 1, which results in the identity matrix.
     If type="hueRotate", then this attribute defaults to the value 0, which results in the identity matrix.
    Animatable: yes.

*/

export const SVG_FECOLORMATRIX_TYPE_UNKNOWN = 0;
export const SVG_FECOLORMATRIX_TYPE_MATRIX = 1;
export const SVG_FECOLORMATRIX_TYPE_SATURATE = 2;
export const SVG_FECOLORMATRIX_TYPE_HUEROTATE = 3;
export const SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA = 4;

export const ColorMatrixTypes = {
    matrix: SVG_FECOLORMATRIX_TYPE_MATRIX,
    saturate: SVG_FECOLORMATRIX_TYPE_SATURATE,
    hueRotate: SVG_FECOLORMATRIX_TYPE_HUEROTATE,
    luminanceToAlpha: SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA,
};

export default class FEColorMatrix extends Component {
    static displayName = "feColorMatrix";

    static defaultProps = {
        type: SVG_FECOLORMATRIX_TYPE_MATRIX,
    };

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { type = SVG_FECOLORMATRIX_TYPE_MATRIX, values } = this.props;
        const _values =
            values && values.map
                ? values.map(s => +s)
                : typeof values === "string"
                ? values
                    .replace(/,|\s\s+/gm, " ")
                    .trim()
                    .split(" ")
                    .map(s => +s)
                : [+values].filter(n => !isNaN(n));
        return (
            <RNSVGFEColorMatrix
                {...extractFilterPrimitive(this.props)}
                in1={this.props.in}
                type={typeof type === 'number' ? type : ColorMatrixTypes[type] || SVG_FECOLORMATRIX_TYPE_UNKNOWN}
                values={_values}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEColorMatrix = requireNativeComponent("RNSVGFEColorMatrix");
