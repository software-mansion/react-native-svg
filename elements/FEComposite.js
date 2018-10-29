import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFECompositeElement

15.25.11 Interface SVGFECompositeElement

The SVGFECompositeElement interface corresponds to the ‘feComposite’ element.

interface SVGFECompositeElement : SVGElement,
                                  SVGFilterPrimitiveStandardAttributes {

  // Composite Operators
  const unsigned short SVG_FECOMPOSITE_OPERATOR_UNKNOWN = 0;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_OVER = 1;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_IN = 2;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_OUT = 3;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_ATOP = 4;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_XOR = 5;
  const unsigned short SVG_FECOMPOSITE_OPERATOR_ARITHMETIC = 6;

  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedString in2;
  readonly attribute SVGAnimatedEnumeration operator;
  readonly attribute SVGAnimatedNumber k1;
  readonly attribute SVGAnimatedNumber k2;
  readonly attribute SVGAnimatedNumber k3;
  readonly attribute SVGAnimatedNumber k4;
};

Constants in group “Composite Operators”:

    SVG_FECOMPOSITE_OPERATOR_UNKNOWN (unsigned short)
    The type is not one of predefined types.
    It is invalid to attempt to define a new value of this type or to attempt to switch an existing value to this type.

    SVG_FECOMPOSITE_OPERATOR_OVER (unsigned short)
    Corresponds to value 'over'.

    SVG_FECOMPOSITE_OPERATOR_IN (unsigned short)
    Corresponds to value 'in'.

    SVG_FECOMPOSITE_OPERATOR_OUT (unsigned short)
    Corresponds to value 'out'.

    SVG_FECOMPOSITE_OPERATOR_ATOP (unsigned short)
    Corresponds to value 'atop'.

    SVG_FECOMPOSITE_OPERATOR_XOR (unsigned short)
    Corresponds to value 'xor'.

    SVG_FECOMPOSITE_OPERATOR_ARITHMETIC (unsigned short)
    Corresponds to value 'arithmetic'.

Attributes:

    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feComposite’ element.

    in2 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in2’ on the given ‘feComposite’ element.

    operator (readonly SVGAnimatedEnumeration)
    Corresponds to attribute ‘operator’ on the given ‘feComposite’ element.
    Takes one of the SVG_FECOMPOSITE_OPERATOR_* constants defined on this interface.

    k1 (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘k1’ on the given ‘feComposite’ element.

    k2 (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘k2’ on the given ‘feComposite’ element.

    k3 (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘k3’ on the given ‘feComposite’ element.

    k4 (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘k4’ on the given ‘feComposite’ element.

https://www.w3.org/TR/SVG11/filters.html#feCompositeElement

15.12 Filter primitive ‘feComposite’

This filter performs the combination of the two input images pixel-wise in image space using one of the Porter-Duff
[PORTERDUFF] compositing operations: over, in, atop, out, xor [SVG-COMPOSITING]. Additionally, a component-wise
arithmetic operation (with the result clamped between [0..1]) can be applied.

The arithmetic operation is useful for combining the output from the ‘feDiffuseLighting’ and ‘feSpecularLighting’
filters with texture data. It is also useful for implementing dissolve. If the arithmetic operation is chosen, each
result pixel is computed using the following formula:

result = k1*i1*i2 + k2*i1 + k3*i2 + k4

where:

i1 and i2 indicate the corresponding pixel channel values of the input image, which map to in and in2 respectively
k1, k2, k3 and k4 indicate the values of the attributes with the same name

For this filter primitive, the extent of the resulting image might grow as described in the section that describes the
filter primitive subregion.

‘feComposite’

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
    ‘in2’
    ‘operator’
    ‘k1’
    ‘k2’
    ‘k3’
    ‘k4’
DOM Interfaces:
    SVGFECompositeElement

Attribute definitions:

    operator = "over | in | out | atop | xor | arithmetic"
    The compositing operation that is to be performed. All of the ‘operator’ types except arithmetic match the
    corresponding operation as described in [PORTERDUFF]. The arithmetic operator is described above. If attribute
    ‘operator’ is not specified, then the effect is as if a value of over were specified.
    Animatable: yes.

    k1 = "<number>"
    Only applicable if operator="arithmetic".
    If the attribute is not specified, the effect is as if a value of 0 were specified.
    Animatable: yes.

    k2 = "<number>"
    Only applicable if operator="arithmetic".
    If the attribute is not specified, the effect is as if a value of 0 were specified.
    Animatable: yes.

    k3 = "<number>"
    Only applicable if operator="arithmetic".
    If the attribute is not specified, the effect is as if a value of 0 were specified.
    Animatable: yes.

    k4 = "<number>"
    Only applicable if operator="arithmetic".
    If the attribute is not specified, the effect is as if a value of 0 were specified.
    Animatable: yes.

    in2 = "(see ‘in’ attribute)"
    The second input image to the compositing operation.
    This attribute can take on the same values as the ‘in’ attribute.
    Animatable: yes.

Example feComposite shows examples of the six types of feComposite operations. It also shows two different techniques to
using the BackgroundImage as part of the compositing operation.

The first two rows render bluish triangles into the background. A filter is applied which composites reddish triangles
into the bluish triangles using one of the compositing operations. The result from compositing is drawn onto an opaque
white temporary surface, and then that result is written to the canvas. (The opaque white temporary surface obliterates
the original bluish triangle.)

The last two rows apply the same compositing operations of reddish triangles into bluish triangles. However, the
compositing result is directly blended into the canvas (the opaque white temporary surface technique is not used).
In some cases, the results are different than when a temporary opaque white surface is used.
The original bluish triangle from the background shines through wherever the compositing operation results in completely
transparent pixel. In other cases, the result from compositing is blended into the bluish triangle, resulting in a
different final color value.

*/

export const SVG_FECOMPOSITE_OPERATOR_UNKNOWN = 0;
export const SVG_FECOMPOSITE_OPERATOR_OVER = 1;
export const SVG_FECOMPOSITE_OPERATOR_IN = 2;
export const SVG_FECOMPOSITE_OPERATOR_OUT = 3;
export const SVG_FECOMPOSITE_OPERATOR_ATOP = 4;
export const SVG_FECOMPOSITE_OPERATOR_XOR = 5;
export const SVG_FECOMPOSITE_OPERATOR_ARITHMETIC = 6;

export const CompositeOperators = {
    over: SVG_FECOMPOSITE_OPERATOR_OVER,
    'in': SVG_FECOMPOSITE_OPERATOR_IN,
    out: SVG_FECOMPOSITE_OPERATOR_OUT,
    atop: SVG_FECOMPOSITE_OPERATOR_ATOP,
    xor: SVG_FECOMPOSITE_OPERATOR_XOR,
    arithmetic: SVG_FECOMPOSITE_OPERATOR_ARITHMETIC
};

export default class FEComposite extends Component {
    static displayName = "feComposite";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const {
            in2,
            operator,
            k1 = 0,
            k2 = 0,
            k3 = 0,
            k4 = 0,
        } = props;
        return (
            <RNSVGFEComposite
                {...extractFilterPrimitive(props)}
                in1={props.in}
                in2={in2}
                operator={operator}
                k1={k1 || 0}
                k2={k2 || 0}
                k3={k3 || 0}
                k4={k4 || 0}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEComposite = requireNativeComponent("RNSVGFEComposite");
