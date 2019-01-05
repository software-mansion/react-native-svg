import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEOffsetElement

15.25.24 Interface SVGFEOffsetElement

The SVGFEOffsetElement interface corresponds to the ‘feOffset’ element.

interface SVGFEOffsetElement : SVGElement,
                               SVGFilterPrimitiveStandardAttributes {
  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedNumber dx;
  readonly attribute SVGAnimatedNumber dy;
};

Attributes:

    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feOffset’ element.

    dx (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘dx’ on the given ‘feOffset’ element.

    dy (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘dy’ on the given ‘feOffset’ element.

https://www.w3.org/TR/SVG11/filters.html#feOffsetElement

15.21 Filter primitive ‘feOffset’

This filter primitive offsets the input image relative to
its current position in the image space by the specified vector.

This is important for effects like drop shadows.

When applying this filter, the destination location may be offset by a fraction of a pixel in device space.
In this case a high quality viewer should make use of appropriate interpolation techniques,
for example bilinear or bicubic.

This is especially recommended for dynamic viewers where this interpolation provides visually smoother movement of
images. For static viewers this is less of a concern. Close attention should be made to the ‘image-rendering’ property
setting to determine the authors intent.

‘feOffset’

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
    ‘dx’
    ‘dy’
DOM Interfaces:
    SVGFEOffsetElement

Attribute definitions:

    dx = "<number>"
    The amount to offset the input graphic along the x-axis. The offset amount is expressed in the coordinate system
    established by attribute ‘primitiveUnits’ on the ‘filter’ element.
    If the attribute is not specified, then the effect is as if a value of 0 were specified.
    Animatable: yes.

    dy = "<number>"
    The amount to offset the input graphic along the y-axis. The offset amount is expressed in the coordinate system
    established by attribute ‘primitiveUnits’ on the ‘filter’ element.
    If the attribute is not specified, then the effect is as if a value of 0 were specified.
    Animatable: yes.
    The example at the start of this chapter makes use of the ‘feOffset’ filter primitive to offset the drop shadow from
    the original source graphic.

*/

export default class FEOffset extends Component {
    static displayName = "feOffset";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this
        const {
            dx = 0,
            dy = 0,
        } = props;
        return (
            <RNSVGFEOffset
                {...extractFilterPrimitive(props)}
                in1={props.in}
                dx={dx}
                dy={dy}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEOffset = requireNativeComponent("RNSVGFEOffset");
