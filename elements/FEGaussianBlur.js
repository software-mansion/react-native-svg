import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFEGaussianBlurElement
https://drafts.fxtf.org/filter-effects/#InterfaceSVGFEGaussianBlurElement

interface SVGFEGaussianBlurElement : SVGElement {

  // Edge Mode Values
  const unsigned short SVG_EDGEMODE_UNKNOWN = 0;
  const unsigned short SVG_EDGEMODE_DUPLICATE = 1;
  const unsigned short SVG_EDGEMODE_WRAP = 2;
  const unsigned short SVG_EDGEMODE_NONE = 3;

  readonly attribute SVGAnimatedString in1;
  readonly attribute SVGAnimatedNumber stdDeviationX;
  readonly attribute SVGAnimatedNumber stdDeviationY;
  readonly attribute SVGAnimatedEnumeration edgeMode;

  void setStdDeviation(float stdDeviationX, float stdDeviationY);
};

SVGFEGaussianBlurElement includes SVGFilterPrimitiveStandardAttributes;

Constants in group “Edge Mode Values”:
    SVG_EDGEMODE_UNKNOWN
    The type is not one of predefined types. It is invalid to attempt to define a new value of this type or to attempt
    to switch an existing value to this type.

    SVG_EDGEMODE_DUPLICATE
    Corresponds to value duplicate.

    SVG_EDGEMODE_WRAP
    Corresponds to value wrap.

    SVG_EDGEMODE_NONE
    Corresponds to value none.

Attributes:
    in1, of type SVGAnimatedString, readonly
    Corresponds to attribute in on the given feGaussianBlur element.

    stdDeviationX, of type SVGAnimatedNumber, readonly
    Corresponds to attribute stdDeviation on the given feGaussianBlur element.
    Contains the X component of attribute stdDeviation.

    stdDeviationY, of type SVGAnimatedNumber, readonly
    Corresponds to attribute stdDeviation on the given feGaussianBlur element.
    Contains the Y component of attribute stdDeviation.

    edgeMode, of type SVGAnimatedEnumeration, readonly
    Corresponds to attribute edgeMode on the given feGaussianBlur element.
    Takes one of the SVG_EDGEMODE_* constants defined on this interface.

Methods:
    setStdDeviation(stdDeviationX, stdDeviationY)
    Sets the values for attribute stdDeviation.

    stdDeviationX
    The X component of attribute stdDeviation.

    stdDeviationY
    The Y component of attribute stdDeviation.

https://www.w3.org/TR/SVG11/filters.html#feGaussianBlurElement
https://drafts.fxtf.org/filter-effects/#elementdef-fegaussianblur

9.14. Filter primitive feGaussianBlur

    Name:	feGaussianBlur
    Categories:	filter primitive
    Content model:	Any number of descriptive elements, animate, script, set elements, in any order.
    Attributes:
        core attributes — id, xml:base, xml:lang, xml:space
        presentation attributes — alignment-baseline, baseline-shift, clip, clip-path, clip-rule, color, color-interpolation, color-interpolation-filters, color-rendering, cursor, direction, display, dominant-baseline, enable-background, fill, fill-opacity, fill-rule, filter, flood-color, flood-opacity, font, font-family, font-size, font-size-adjust, font-stretch, font-style, font-variant, font-weight, glyph-orientation-horizontal, glyph-orientation-vertical, image-rendering, isolation, kerning, letter-spacing, lighting-color, marker, marker-end, marker-mid, marker-start, mask, opacity, overflow, pointer-events, shape-rendering, stop-color, stop-opacity, stroke, stroke-dasharray, stroke-dashoffset, stroke-linecap, stroke-linejoin, stroke-miterlimit, stroke-opacity, stroke-width, text-anchor, text-decoration, text-rendering, unicode-bidi, visibility, word-spacing, writing-mode
        filter primitive attributes —x, y, width, height, result
        class
        style
        in
        stdDeviation
        edgeMode
    DOM Interfaces:	SVGFEGaussianBlurElement

This filter primitive performs a Gaussian blur on the input image.

The Gaussian blur kernel is an approximation of the normalized convolution:

G(x,y) = H(x)I(y)

where

H(x) = exp(-x2/ (2s2)) / sqrt(2π * s2)

and

I(y) = exp(-y2/ (2t2)) / sqrt(2π * t2)

with "s" being the standard deviation in the x direction and "t" being the standard deviation in the y direction,
as specified by stdDeviation.

The value of stdDeviation can be either one or two numbers. If two numbers are provided, the first number represents a
standard deviation value along the x-axis of the current coordinate system and the second value represents a standard
deviation in Y. If one number is provided, then that value is used for both X and Y.

Even if only one value is provided for stdDeviation, this can be implemented as a separable convolution.

For larger values of "s" (s >= 2.0), an approximation can be used: Three successive box-blurs build a piece-wise
quadratic convolution kernel, which approximates the Gaussian kernel to within roughly 3%.

let d = floor(s * 3 * sqrt(2 * π) / 4 + 0.5)

... if d is odd, use three box-blurs of size "d", centered on the output pixel.

... if d is even, two box-blurs of size "d" (the first one centered on the pixel boundary between the output pixel and
the one to the left, the second one centered on the pixel boundary between the output pixel and the one to the right)
and one box blur of size "d+1" centered on the output pixel.

The approximation formula also applies correspondingly to "t".

Frequently this operation will take place on alpha-only images, such as that produced by the built-in input,
SourceAlpha. The implementation may notice this and optimize the single channel case. This optimization must be omitted
if it leads to privacy concerns of any matter. (See section Privacy and Security Considerations for more details about
timing attacks.) If the input has infinite extent and is constant (e.g FillPaint where the fill is a solid color),
this operation has no effect. If the input has infinite extent and the filter result where the fill is a solid color)
is the input to an feTile, the filter is evaluated with periodic boundary conditions.

Attribute definitions:

    stdDeviation = "<number-optional-number>"
        The standard deviation for the blur operation. If two <number> s are provided, the first number represents a
        standard deviation value along the x-axis of the coordinate system established by attribute primitiveUnits on
        the filter element. The second value represents a standard deviation in Y. If one number is provided, then that
        value is used for both X and Y.

        A negative value or a value of zero disables the effect of the given filter primitive (i.e., the result is the
        filter input image).

        If stdDeviation is 0 in only one of X or Y, then the effect is that the blur is only applied in the direction
        that has a non-zero value.

        The initial value for stdDeviation is 0.

        Animatable: yes.

    edgeMode = "duplicate | wrap | none"
        Determines how to extend the input image as necessary with color values so that the matrix operations can be
        applied when the kernel is positioned at or near the edge of the input image.

        duplicate indicates that the input image is extended along each of its borders as necessary by duplicating the
        color values at the given edge of the input image.

        Original N-by-M image, where m=M-1 and n=N-1:

        wrap indicates that the input image is extended by taking the color values from the opposite edge of the image.

        The value none indicates that the input image is extended with pixel values of zero for R, G, B and A.

        The initial value for edgeMode is none.

        Animatable: yes.
 */

// Edge Mode Values
export const SVG_EDGEMODE_UNKNOWN = 0;
export const SVG_EDGEMODE_DUPLICATE = 1;
export const SVG_EDGEMODE_WRAP = 2;
export const SVG_EDGEMODE_NONE = 3;

export const edgeModeValues = {
    duplicate: SVG_EDGEMODE_DUPLICATE,
    wrap: SVG_EDGEMODE_WRAP,
    none: SVG_EDGEMODE_NONE,
};

export default class FEGaussianBlur extends Component {
    static displayName = "feGaussianBlur";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { edgeMode, stdDeviation } = this.props;
        const stdD =
            stdDeviation && stdDeviation.map
                ? stdDeviation.map(s => +s)
                : typeof stdDeviation === "string"
                ? stdDeviation
                    .replace(/,|\s\s+/gm, " ")
                    .trim()
                    .split(" ")
                    .map(s => +s)
                : [+stdDeviation].filter(n => !isNaN(n));
        return (
            <RNSVGFEGaussianBlur
                {...extractFilterPrimitive(this.props)}
                {...{
                    in1: this.props.in,
                    edgeMode: edgeModeValues[edgeMode] || SVG_EDGEMODE_UNKNOWN,
                    stdDeviationX: stdD[0] || 0,
                    stdDeviationY: (stdD.length > 1 ? stdD[1] : stdD[0]) || 0,
                }}
                ref={r => {
                    this.root = r;
                }}
            />
        );
    }
}

const RNSVGFEGaussianBlur = requireNativeComponent("RNSVGFEGaussianBlur");
