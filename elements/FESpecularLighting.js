import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFESpecularLightingElement

15.25.25 Interface SVGFESpecularLightingElement

The SVGFESpecularLightingElement interface corresponds to the ‘feSpecularLighting’ element.

interface SVGFESpecularLightingElement : SVGElement,
                                         SVGFilterPrimitiveStandardAttributes {
  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedNumber surfaceScale;
  readonly attribute SVGAnimatedNumber specularConstant;
  readonly attribute SVGAnimatedNumber specularExponent;
  readonly attribute SVGAnimatedNumber kernelUnitLengthX;
  readonly attribute SVGAnimatedNumber kernelUnitLengthY;
};

Attributes:

    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feSpecularLighting’ element.

    surfaceScale (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘surfaceScale’ on the given ‘feSpecularLighting’ element.

    specularConstant (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘specularConstant’ on the given ‘feSpecularLighting’ element.

    specularExponent (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘specularExponent’ on the given ‘feSpecularLighting’ element.

    kernelUnitLengthX (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘kernelUnitLength’ on the given ‘feSpecularLighting’ element.

    kernelUnitLengthY (readonly SVGAnimatedNumber)
    Corresponds to attribute ‘kernelUnitLength’ on the given ‘feSpecularLighting’ element.

https://www.w3.org/TR/SVG11/filters.html#feSpecularLightingElement

15.22 Filter primitive ‘feSpecularLighting’

This filter primitive lights a source graphic using the alpha channel as a bump map. The resulting image is an RGBA
image based on the light color. The lighting calculation follows the standard specular component of the Phong lighting
model. The resulting image depends on the light color, light position and surface geometry of the input bump map. The
result of the lighting calculation is added. The filter primitive assumes that the viewer is at infinity in the z
direction (i.e., the unit vector in the eye direction is (0,0,1) everywhere).

This filter primitive produces an image which contains the specular reflection part of the lighting calculation. Such a
map is intended to be combined with a texture using the add term of the arithmetic ‘feComposite’ method. Multiple light
sources can be simulated by adding several of these light maps before applying it to the texture image.

The resulting RGBA image is computed as follows:

Sr = ks * pow(N.H, specularExponent) * Lr
Sg = ks * pow(N.H, specularExponent) * Lg
Sb = ks * pow(N.H, specularExponent) * Lb
Sa = max(Sr, Sg, Sb)

where

ks = specular lighting constant
N = surface normal unit vector, a function of x and y
H = "halfway" unit vector between eye unit vector and light unit vector

Lr,Lg,Lb = RGB components of light

See ‘feDiffuseLighting’ for definition of N and (Lr, Lg, Lb).

The definition of H reflects our assumption of the constant eye vector E = (0,0,1):

H = (L + E) / Norm(L+E)

where L is the light unit vector.

Unlike the ‘feDiffuseLighting’, the ‘feSpecularLighting’ filter produces a non-opaque image. This is due to the fact
that the specular result (Sr,Sg,Sb,Sa) is meant to be added to the textured image. The alpha channel of the result is
the max of the color components, so that where the specular light is zero, no additional coverage is added to the image
and a fully white highlight will add opacity.

The ‘feDiffuseLighting’ and ‘feSpecularLighting’ filters will often be applied together. An implementation may detect
this and calculate both maps in one pass, instead of two.

‘feSpecularLighting’

Categories:
    Filter primitive element
Content model:
    Any number of descriptive elements and exactly one light source element, in any order.
Attributes:
    core attributes
    presentation attributes
    filter primitive attributes
    ‘class’
    ‘style’
    ‘in’
    ‘surfaceScale’
    ‘specularConstant’
    ‘specularExponent’
    ‘kernelUnitLength’
DOM Interfaces:
    SVGFESpecularLightingElement

Attribute definitions:

    surfaceScale = "<number>"
    height of surface when Ain = 1.
    If the attribute is not specified, then the effect is as if a value of 1 were specified.
    Animatable: yes.

    specularConstant = "<number>"
    ks in Phong lighting model. In SVG, this can be any non-negative number.
    If the attribute is not specified, then the effect is as if a value of 1 were specified.
    Animatable: yes.

    specularExponent = "<number>"
    Exponent for specular term, larger is more "shiny". Range 1.0 to 128.0.
    If the attribute is not specified, then the effect is as if a value of 1 were specified.
    Animatable: yes.

    kernelUnitLength = "<number-optional-number>"
    The first number is the <dx> value. The second number is the <dy> value. If the <dy> value is not specified, it
    defaults to the same value as <dx>. Indicates the intended distance in current filter units (i.e., units as
    determined by the value of attribute ‘primitiveUnits’) for dx and dy, respectively, in the surface normal
    calculation formulas. By specifying value(s) for ‘kernelUnitLength’, the kernel becomes defined in a scalable,
    abstract coordinate system. If ‘kernelUnitLength’ is not specified, the dx and dy values should represent very small
    deltas relative to a given (x,y) position, which might be implemented in some cases as one pixel in the intermediate
    image offscreen bitmap, which is a pixel-based coordinate system, and thus potentially not scalable. For some level
    of consistency across display media and user agents, it is necessary that a value be provided for at least one of
    ‘filterRes’ and ‘kernelUnitLength’. Discussion of intermediate images are in the Introduction and in the description
    of attribute ‘filterRes’.
    A negative or zero value is an error (see Error processing).
    Animatable: yes.

    The light source is defined by one of the child elements ‘feDistantLight’, ‘fePointLight’ or ‘feDistantLight’. The
    light color is specified by property ‘lighting-color’.

    The example at the start of this chapter makes use of the ‘feSpecularLighting’ filter primitive to achieve a highly
    reflective, 3D glowing effect.

*/

export default class FESpecularLighting extends Component {
    static displayName = "feSpecularLighting";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const {
            surfaceScale = 1,
            specularConstant = 1,
            specularExponent = 1,
            kernelUnitLength,
            lightingColor,
        } = props;
        const kUL =
            kernelUnitLength !== undefined && (kernelUnitLength.map
                ? kernelUnitLength.map(s => +s)
                : typeof kernelUnitLength === "string"
                ? kernelUnitLength
                    .replace(/,|\s\s+/gm, " ")
                    .trim()
                    .split(" ")
                    .map(s => +s)
                : [+kernelUnitLength].filter(n => !isNaN(n)));
        return (
            <RNSVGFESpecularLighting
                {...extractFilterPrimitive(props)}
                in1={props.in}
                lightingColor={lightingColor}
                surfaceScale={surfaceScale}
                specularConstant={specularConstant}
                specularExponent={specularExponent}
                kernelUnitLengthX={kernelUnitLength && kUL[0]}
                kernelUnitLengthY={kernelUnitLength && (kUL.length > 1 ? kUL[1] : kUL[0])}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFESpecularLighting = requireNativeComponent("RNSVGFESpecularLighting");
