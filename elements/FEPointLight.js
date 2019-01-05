import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEPointLightElement

15.25.15 Interface SVGFEPointLightElement

The SVGFEPointLightElement interface corresponds to the ‘fePointLight’ element.

interface SVGFEPointLightElement : SVGElement {
  readonly attribute SVGAnimatedNumber x;
  readonly attribute SVGAnimatedNumber y;
  readonly attribute SVGAnimatedNumber z;
};

Attributes:

    x (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘x’ on the given ‘fePointLight’ element.

    y (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘y’ on the given ‘fePointLight’ element.

    z (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘z’ on the given ‘fePointLight’ element.

https://www.w3.org/TR/SVG11/filters.html#fePointLightElement

15.8.3 Light source ‘fePointLight’

‘fePointLight’

Categories:
    Light source element
Content model:
    Any number of the following elements, in any order:
    ‘animate’
    ‘set’
Attributes:
    core attributes 
    ‘x’
    ‘y’
    ‘z’
DOM Interfaces:
    SVGFEPointLightElement
    
Attribute definitions:
    
    x = "<number>"
    X location for the light source in the coordinate system established by attribute ‘primitiveUnits’ on the ‘filter’ element.
    If the attribute is not specified, then the effect is as if a value of 0 were specified.
    Animatable: yes.

    y = "<number>"
    Y location for the light source in the coordinate system established by attribute ‘primitiveUnits’ on the ‘filter’ element.
    If the attribute is not specified, then the effect is as if a value of 0 were specified.
    Animatable: yes.

    z = "<number>"
    Z location for the light source in the coordinate system established by attribute ‘primitiveUnits’ on the ‘filter’ element, 
    assuming that, in the initial coordinate system, the positive Z-axis comes out towards the person viewing the 
    content and assuming that one unit along the Z-axis equals one unit in X and Y.
    If the attribute is not specified, then the effect is as if a value of 0 were specified.
    Animatable: yes.

*/

export default class FEPointLight extends Component {
    static displayName = "fePointLight";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { x, y, z} = this.props;
        return (
            <RNSVGFEPointLight
                x={x}
                y={y}
                z={z}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEPointLight = requireNativeComponent("RNSVGFEPointLight");
