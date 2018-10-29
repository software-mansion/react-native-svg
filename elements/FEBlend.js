import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEBlendElement

15.25.3 Interface SVGFEBlendElement

The SVGFEBlendElement interface corresponds to the ‘feBlend’ element.

interface SVGFEBlendElement : SVGElement,
                              SVGFilterPrimitiveStandardAttributes {

  // Blend Mode Types
  const unsigned short SVG_FEBLEND_MODE_UNKNOWN = 0;
  const unsigned short SVG_FEBLEND_MODE_NORMAL = 1;
  const unsigned short SVG_FEBLEND_MODE_MULTIPLY = 2;
  const unsigned short SVG_FEBLEND_MODE_SCREEN = 3;
  const unsigned short SVG_FEBLEND_MODE_DARKEN = 4;
  const unsigned short SVG_FEBLEND_MODE_LIGHTEN = 5;

  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedString in2;
  readonly attribute SVGAnimatedEnumeration mode;
};

Constants in group “Blend Mode Types”:

    SVG_FEBLEND_MODE_UNKNOWN (unsigned short)
    The type is not one of predefined types.
    It is invalid to attempt to define a new value of this type or to attempt to switch an existing value to this type.

    SVG_FEBLEND_MODE_NORMAL (unsigned short)
    Corresponds to value 'normal'.

    SVG_FEBLEND_MODE_MULTIPLY (unsigned short)
    Corresponds to value 'multiply'.

    SVG_FEBLEND_MODE_SCREEN (unsigned short)
    Corresponds to value 'screen'.

    SVG_FEBLEND_MODE_DARKEN (unsigned short)
    Corresponds to value 'darken'.

    SVG_FEBLEND_MODE_LIGHTEN (unsigned short)
    Corresponds to value 'lighten'.

Attributes:

    in1 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in’ on the given ‘feBlend’ element.

    in2 (readonly SVGAnimatedString)
    Corresponds to attribute ‘in2’ on the given ‘feBlend’ element.

    mode (readonly SVGAnimatedEnumeration)
    Corresponds to attribute ‘mode’ on the given ‘feBlend’ element.
    Takes one of the SVG_FEBLEND_MODE_* constants defined on this interface.

https://www.w3.org/TR/SVG11/filters.html#feCompositeElement

15.9 Filter primitive ‘feBlend’

This filter composites two objects together using commonly used imaging software blending modes.
It performs a pixel-wise combination of two input images.

‘feBlend’

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
    ‘mode’
DOM Interfaces:
    SVGFEBlendElement

Attribute definitions:

    mode = "normal | multiply | screen | darken | lighten"
    One of the image blending modes (see table below).
    If attribute ‘mode’ is not specified, then the effect is as if a value of normal were specified.
    Animatable: yes.

    in2 = "(see ‘in’ attribute)"
    The second input image to the blending operation. This attribute can take on the same values as the ‘in’ attribute.
    Animatable: yes.

    For all feBlend modes, the result opacity is computed as follows:

    qr = 1 - (1-qa)*(1-qb)

    For the compositing formulas below, the following definitions apply:

    cr = Result color (RGB) - premultiplied
    qa = Opacity value at a given pixel for image A
    qb = Opacity value at a given pixel for image B
    ca = Color (RGB) at a given pixel for image A - premultiplied
    cb = Color (RGB) at a given pixel for image B - premultiplied
    The following table provides the list of available image blending modes:

    Image Blending Mode	Formula for computing result color

    normal	cr = (1 - qa) * cb + ca
    multiply	cr = (1-qa)*cb + (1-qb)*ca + ca*cb
    screen	cr = cb + ca - ca * cb
    darken	cr = Min ((1 - qa) * cb + ca, (1 - qb) * ca + cb)
    lighten	cr = Max ((1 - qa) * cb + ca, (1 - qb) * ca + cb)

    'normal' blend mode is equivalent to operator="over" on the ‘feComposite’ filter primitive,
    matches the blending method used by ‘feMerge’ and matches the simple alpha compositing technique used in SVG for all
    compositing outside of filter effects.

Example feBlend shows examples of the five blend modes.

<?xml version="1.0"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
          "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="5cm" height="5cm" viewBox="0 0 500 500"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <title>Example feBlend - Examples of feBlend modes</title>
  <desc>Five text strings blended into a gradient,
        with one text string for each of the five feBlend modes.</desc>
  <defs>
    <linearGradient id="MyGradient" gradientUnits="userSpaceOnUse"
            x1="100" y1="0" x2="300" y2="0">
      <stop offset="0" stop-color="#000000" />
      <stop offset=".33" stop-color="#ffffff" />
      <stop offset=".67" stop-color="#ff0000" />
      <stop offset="1" stop-color="#808080" />
    </linearGradient>
    <filter id="Normal">
      <feBlend mode="normal" in2="BackgroundImage" in="SourceGraphic"/>
    </filter>
    <filter id="Multiply">
      <feBlend mode="multiply" in2="BackgroundImage" in="SourceGraphic"/>
    </filter>
    <filter id="Screen">
      <feBlend mode="screen" in2="BackgroundImage" in="SourceGraphic"/>
    </filter>
    <filter id="Darken">
      <feBlend mode="darken" in2="BackgroundImage" in="SourceGraphic"/>
    </filter>
    <filter id="Lighten">
      <feBlend mode="lighten" in2="BackgroundImage" in="SourceGraphic"/>
    </filter>
  </defs>
  <rect fill="none" stroke="blue"
        x="1" y="1" width="498" height="498"/>
  <g enable-background="new" >
    <rect x="100" y="20" width="300" height="460" fill="url(#MyGradient)" />
    <g font-family="Verdana" font-size="75" fill="#888888" fill-opacity=".6" >
      <text x="50" y="90" filter="url(#Normal)" >Normal</text>
      <text x="50" y="180" filter="url(#Multiply)" >Multiply</text>
      <text x="50" y="270" filter="url(#Screen)" >Screen</text>
      <text x="50" y="360" filter="url(#Darken)" >Darken</text>
      <text x="50" y="450" filter="url(#Lighten)" >Lighten</text>
    </g>
  </g>
</svg>

*/

export const SVG_FEBLEND_MODE_UNKNOWN = 0;
export const SVG_FEBLEND_MODE_NORMAL = 1;
export const SVG_FEBLEND_MODE_MULTIPLY = 2;
export const SVG_FEBLEND_MODE_SCREEN = 3;
export const SVG_FEBLEND_MODE_DARKEN = 4;
export const SVG_FEBLEND_MODE_LIGHTEN = 5;

export const BlendModeTypes = {
    normal: SVG_FEBLEND_MODE_NORMAL,
    multiply: SVG_FEBLEND_MODE_MULTIPLY,
    screen: SVG_FEBLEND_MODE_SCREEN,
    darken: SVG_FEBLEND_MODE_DARKEN,
    lighten: SVG_FEBLEND_MODE_LIGHTEN
};

export default class FEBlend extends Component {
    static displayName = "feBlend";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const {
            in2,
            mode = SVG_FEBLEND_MODE_NORMAL
        } = props;
        return (
            <RNSVGFEBlend
                {...extractFilterPrimitive(props)}
                in1={props.in}
                in2={in2}
                mode={typeof mode === 'number' ? mode : BlendModeTypes[mode] || SVG_FEBLEND_MODE_UNKNOWN}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEBlend = requireNativeComponent("RNSVGFEBlend");
