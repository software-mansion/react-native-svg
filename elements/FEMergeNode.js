import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEMergeNodeElement

interface SVGFEMergeNodeElement : SVGElement {
  readonly attribute SVGAnimatedString in1;
};

Attributes:
    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feMergeNode’ element.

https://www.w3.org/TR/SVG11/filters.html#feMergeNodeElement

‘feMergeNode’

Categories:
    None
Content model:
    Any number of the following elements, in any order:
    ‘animate’
    ‘set’
Attributes:
    core attributes
    ‘in’
DOM Interfaces:
    SVGFEMergeNodeElement
 */

export default class FEMergeNode extends Component {
    static displayName = "feMergeNode";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        return (
            <RNSVGFEMergeNode
                in1={this.props.in}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEMergeNode = requireNativeComponent("RNSVGFEMergeNode");
