import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import UNITS from "../lib/units";

/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFilterElement

interface SVGFilterElement : SVGElement,
                             SVGURIReference,
                             SVGLangSpace,
                             SVGExternalResourcesRequired,
                             SVGStylable,
                             SVGUnitTypes {

  readonly attribute SVGAnimatedEnumeration filterUnits;
  readonly attribute SVGAnimatedEnumeration primitiveUnits;
  readonly attribute SVGAnimatedLength x;
  readonly attribute SVGAnimatedLength y;
  readonly attribute SVGAnimatedLength width;
  readonly attribute SVGAnimatedLength height;
  readonly attribute SVGAnimatedInteger filterResX;
  readonly attribute SVGAnimatedInteger filterResY;

  void setFilterRes(in unsigned long filterResX, in unsigned long filterResY) raises(DOMException);
};

https://www.w3.org/TR/SVG11/filters.html#FilterElement

15.3 The ‘filter’ element
The description of the ‘filter’ element follows:

‘filter’

Categories:
    None

Content model:
    Any number of the following elements, in any order:
    descriptive elements
    filter primitive elements
    ‘animate’
    ‘set’

Attributes:
    core attributes
    presentation attributes
    xlink attributes
    ‘class’
    ‘style’
    ‘externalResourcesRequired’
    ‘x’
    ‘y’
    ‘width’
    ‘height’
    ‘filterRes’
    ‘filterUnits’
    ‘primitiveUnits’
    ‘xlink:href’

DOM Interfaces:
    SVGFilterElement

Attribute definitions:

filterUnits = "userSpaceOnUse | objectBoundingBox"
    See Filter effects region.

primitiveUnits = "userSpaceOnUse | objectBoundingBox"
    Specifies the coordinate system for the various length values within the filter primitives and for the attributes
    that define the filter primitive subregion.

    If primitiveUnits="userSpaceOnUse", any length values within the filter definitions represent values in the current
    user coordinate system in place at the time when the ‘filter’ element is referenced (i.e., the user coordinate
    system for the element referencing the ‘filter’ element via a ‘filter’ property).

    If primitiveUnits="objectBoundingBox", then any length values within the filter definitions represent fractions or
    percentages of the bounding box on the referencing element (see Object bounding box units). Note that if only one
    number was specified in a <number-optional-number> value this number is expanded out before the ‘primitiveUnits’
    computation takes place.

    If attribute ‘primitiveUnits’ is not specified, then the effect is as if a value of userSpaceOnUse were specified.
    Animatable: yes.

x = "<coordinate>"
    See Filter effects region.

y = "<coordinate>"
    See Filter effects region.

width = "<length>"
    See Filter effects region.

height = "<length>"
    See Filter effects region.

filterRes = "<number-optional-number>"
    See Filter effects region.

xlink:href = "<iri>"
    An IRI reference to another ‘filter’ element within the current SVG document fragment. Any attributes which are
    defined on the referenced ‘filter’ element which are not defined on this element are inherited by this element.
    If this element has no defined filter nodes, and the referenced element has defined filter nodes (possibly due to
    its own ‘xlink:href’ attribute), then this element inherits the filter nodes defined from the referenced ‘filter’
    element. Inheritance can be indirect to an arbitrary level; thus, if the referenced ‘filter’ element inherits
    attributes or its filter node specification due to its own ‘xlink:href’ attribute, then the current element can
    inherit those attributes or filter node specifications.
    Animatable: yes.

Properties inherit into the ‘filter’ element from its ancestors; properties do not inherit from the element referencing
the ‘filter’ element.

‘filter’ elements are never rendered directly; their only usage is as something that can be referenced using the
‘filter’ property. The ‘display’ property does not apply to the ‘filter’ element; thus, ‘filter’ elements are not
directly rendered even if the ‘display’ property is set to a value other than none, and ‘filter’ elements are available
for referencing even when the ‘display’ property on the ‘filter’ element or any of its ancestors is set to none.

15.4 The ‘filter’ property
The description of the ‘filter’ property is as follows:

    ‘filter’
        Value:  	<funciri> | none | inherit
        Initial:  	none
        Applies to:  	container elements (except ‘mask’) and graphics elements
        Inherited:  	no
        Percentages:  	N/A
        Media:  	visual
        Animatable:  	yes
    <funciri>
        An Functional IRI reference to a ‘filter’ element which defines the filter effects that shall be applied to
        this element.
    none
        Do not apply any filter effects to this element.

15.5 Filter effects region

A ‘filter’ element can define a region on the canvas to which a given filter effect applies and can provide a resolution
for any intermediate continuous tone images used to process any raster-based filter primitives. The ‘filter’ element
has the following attributes which work together to define the filter effects region:

‘filterUnits’
    Defines the coordinate system for attributes ‘x’, ‘y’, ‘width’ and ‘height’.

    If filterUnits="userSpaceOnUse", ‘x’, ‘y’, ‘width’ and ‘height’ represent values in the current user coordinate
    system in place at the time when the ‘filter’ is referenced (i.e., the user coordinate system for the element
    referencing the ‘filter’ via a ‘filter’ property).

    If filterUnits="objectBoundingBox", then ‘x’, ‘y’, ‘width’ and ‘height’ represent fractions or percentages of the
    bounding box on the referencing element (see Object bounding box units).

    If attribute ‘filterUnits’ is not specified, then the effect is if a value of 'objectBoundingBox' were specified.

    Animatable: yes.

‘x’, ‘y’, ‘width’ and ‘height’
    These attributes define a rectangular region on the canvas to which this filter applies.

    The amount of memory and processing time required to apply the filter are related to the size of this rectangle and
    the ‘filterRes’ attribute of the filter.

    The coordinate system for these attributes depends on the value for attribute ‘filterUnits’.

    Negative values for ‘width’ or ‘height’ are an error (see Error processing). Zero values disable rendering of the
    element which referenced the filter.

    The bounds of this rectangle act as a hard clipping region for each filter primitive included with a given ‘filter’
    element; thus, if the effect of a given filter primitive would extend beyond the bounds of the rectangle (this
    sometimes happens when using a ‘feGaussianBlur’ filter primitive with a very large ‘stdDeviation’), parts of the
    effect will get clipped.

    If ‘x’ or ‘y’ is not specified, the effect is as if a value of -10% were specified.

    If ‘width’ or ‘height’ is not specified, the effect is as if a value of 120% were specified.

    Animatable: yes.

‘filterRes’
    This attribute takes the form x-pixels [y-pixels], and indicates the width and height of the intermediate images in
    pixels. If not provided, then the user agent will use reasonable values to produce a high-quality result on the
    output device.

    Care should be taken when assigning a non-default value to this attribute. Too small of a value may result in
    unwanted pixelation in the result. Too large of a value may result in slow processing and large memory usage.

    Negative values are an error (see Error processing). Zero values disable rendering of the element which referenced
    the filter.

    Non-integer values are truncated, i.e rounded to the closest integer value towards zero.

    Animatable: yes.

Note that both of the two possible value for ‘filterUnits’ (i.e., 'objectBoundingBox' and 'userSpaceOnUse') result in a
filter region whose coordinate system has its X-axis and Y-axis each parallel to the X-axis and Y-axis, respectively, of
the user coordinate system for the element to which the filter will be applied.

Sometimes implementers can achieve faster performance when the filter region can be mapped directly to device pixels;
thus, for best performance on display devices, it is suggested that authors define their region such that SVG user agent
can align the filter region pixel-for-pixel with the background. In particular, for best filter effects performance,
avoid rotating or skewing the user coordinate system. Explicit values for attribute ‘filterRes’ can either help or harm
performance. If ‘filterRes’ is smaller than the automatic (i.e., default) filter resolution, then filter effect might
have faster performance (usually at the expense of quality). If ‘filterRes’ is larger than the automatic (i.e., default)
filter resolution, then filter effects performance will usually be slower.

It is often necessary to provide padding space because the filter effect might impact bits slightly outside the
tight-fitting bounding box on a given object. For these purposes, it is possible to provide negative percentage values
for ‘x’ and ‘y’, and percentages values greater than 100% for ‘width’ and ‘height’. This, for example, is why the
defaults for the filter effects region are x="-10%" y="-10%" width="120%" height="120%".

*/
export default class Filter extends Component {
    static displayName = "filter";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const {
            id,
            x,
            y,
            width,
            height,
            filterRes,
            filterUnits,
            primitiveUnits,
            children,
        } = this.props;

        const fr = `${filterRes}`
            .replace(/,|\s\s+/gm, " ")
            .trim()
            .split(" ");

        return (
            <RNSVGFilter
                ref={r => {
                    this.root = r;
                }}
                name={id}
                x={x}
                y={y}
                width={width}
                height={height}
                filterResX={fr[0]}
                filterResY={fr.length > 1 ? fr[1] : fr[0]}
                filterUnits={filterUnits !== undefined ? UNITS[filterUnits] : 0}
                primitiveUnits={
                    primitiveUnits !== undefined ? UNITS[primitiveUnits] : 1
                }
            >
                {children}
            </RNSVGFilter>
        );
    }
}

const RNSVGFilter = requireNativeComponent("RNSVGFilter");
