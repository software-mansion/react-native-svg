import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEMergeElement

interface SVGFEMergeElement : SVGElement,
                              SVGFilterPrimitiveStandardAttributes {
};

https://www.w3.org/TR/SVG11/filters.html#feMergeElement

15.19 Filter primitive ‘feMerge’
This filter primitive composites input image layers on top of each other using the over operator with
Input1 (corresponding to the first ‘feMergeNode’ child element) on the bottom and the last specified input,
InputN (corresponding to the last ‘feMergeNode’ child element), on top.

Many effects produce a number of intermediate layers in order to create the final output image.
This filter allows us to collapse those into a single image. Although this could be done by using n-1 Composite-filters,
it is more convenient to have this common operation available in this form, and offers the implementation some
additional flexibility.

Each ‘feMerge’ element can have any number of ‘feMergeNode’ subelements, each of which has an ‘in’ attribute.

The canonical implementation of feMerge is to render the entire effect into one RGBA layer, and then render the
resulting layer on the output device. In certain cases (in particular if the output device itself is a continuous tone
device), and since merging is associative, it might be a sufficient approximation to evaluate the effect one layer at a
time and render each layer individually onto the output device bottom to top.

If the topmost image input is SourceGraphic and this ‘feMerge’ is the last filter primitive in the filter, the
implementation is encouraged to render the layers up to that point, and then render the SourceGraphic directly from its
vector description on top.

‘feMerge’

Categories:
    Filter primitive element
Content model:
    Any number of the following elements, in any order:
    ‘feMergeNode’
Attributes:
    core attributes
    presentation attributes
    filter primitive attributes
    ‘class’
    ‘style’
DOM Interfaces:
    SVGFEMergeElement
 */

export default class SVGFEMerge extends Component {
    static displayName = "feMerge";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        return (
            <RNSVGFEMerge
                {...extractFilterPrimitive(this.props)}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEMerge = requireNativeComponent("RNSVGFEMerge");
