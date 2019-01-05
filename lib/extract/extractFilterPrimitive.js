
/*

https://www.w3.org/TR/SVG11/filters.html#InterfaceSVGFilterPrimitiveStandardAttributes

15.25.2 Interface SVGFilterPrimitiveStandardAttributes

This interface defines the set of DOM attributes that are common across the filter primitive interfaces.

interface SVGFilterPrimitiveStandardAttributes : SVGStylable {
  readonly attribute SVGAnimatedLength x;
  readonly attribute SVGAnimatedLength y;
  readonly attribute SVGAnimatedLength width;
  readonly attribute SVGAnimatedLength height;
  readonly attribute SVGAnimatedString result;
};

Attributes:

    x (readonly SVGAnimatedLength)
    Corresponds to attribute ‘x’ on the given element.

    y (readonly SVGAnimatedLength)
    Corresponds to attribute ‘y’ on the given element.

    width (readonly SVGAnimatedLength)
    Corresponds to attribute ‘width’ on the given element.

    height (readonly SVGAnimatedLength)
    Corresponds to attribute ‘height’ on the given element.

    result (readonly SVGAnimatedString)
    Corresponds to attribute ‘result’ on the given element.

https://www.w3.org/TR/filter-effects-1/#CommonAttributes

8.2. Common filter primitive attributes
The following filter primitive attributes are available for all filter primitives:

Attribute definitions:

x = "<length> | <percentage>"

    The minimum x coordinate for the subregion which restricts calculation and rendering of the given filter primitive.
    See filter primitive subregion.

    The lacuna value for x is 0%.

    Animatable: yes.

y = "<length> | <percentage>"

    The minimum y coordinate for the subregion which restricts calculation and rendering of the given filter primitive.
    See filter primitive subregion.

    The lacuna value for y is 0%.

    Animatable: yes.

width = "<length> | <percentage>"

    The width of the subregion which restricts calculation and rendering of the given filter primitive.
    See filter primitive subregion.

    A negative or zero value disables the effect of the given filter primitive
    (i.e., the result is a transparent black image).

    The lacuna value for width is 100%.

    Animatable: yes.

height = "<length> | <percentage>"

    The height of the subregion which restricts calculation and rendering of the given filter primitive.
    See filter primitive subregion.

    A negative or zero value must disable the effect of the given filter primitive
    (i.e., the result is a transparent black image).

    The lacuna value for height is 100%.

    Animatable: yes.

result = "<filter-primitive-reference>"
    <filter-primitive-reference> is an <custom-ident> [CSS3VAL] and an assigned name for this filter primitive.
    If supplied, then graphics that result from processing this filter primitive can be referenced by an in attribute on
    a subsequent filter primitive within the same filter element. If no value is provided, the output will only be
    available for re-use as the implicit input into the next filter primitive if that filter primitive provides no
    value for its in attribute.

Most filter primitives take other filter primitives as input. The following attribute is representative for all input
attributes to reference other filter primitives:

Attribute definitions:

in = "SourceGraphic | SourceAlpha | BackgroundImage | BackgroundAlpha | FillPaint | StrokePaint | <filter-primitive-reference>"
    Identifies input for the given filter primitive. The value can be either one of six keywords or can be a string
    which matches a previous result attribute value within the same filter element. If no value is provided and this is
    the first filter primitive, then this filter primitive will use SourceGraphic as its input. If no value is provided
    and this is a subsequent filter primitive, then this filter primitive will use the result from the previous filter
    primitive as its input.

    If the value for result appears multiple times within a given filter element, then a reference to that result will
    use the closest preceding filter primitive with the given value for attribute result.

    Forward references to results are not allowed, and will be treated as if no result was specified.

    References to non-existent results will be treated as if no result was specified.

Definitions for the six keywords:

    SourceGraphic
        This keyword represents the graphics elements that were the original input into the filter element. For raster
        effects filter primitives, the graphics elements will be rasterized into an initially clear RGBA raster in image
        space. Pixels left untouched by the original graphic will be left clear. The image is specified to be rendered
        in linear RGBA pixels. The alpha channel of this image captures any anti-aliasing specified by SVG. (Since the
        raster is linear, the alpha channel of this image will represent the exact percent coverage of each pixel.)

    SourceAlpha
        This keyword represents the graphics elements that were the original input into the filter element. SourceAlpha
        has all of the same rules as SourceGraphic except that only the alpha channel is used. The input image is an
        RGBA image consisting of implicitly black color values for the RGB channels, but whose alpha channel is the same
        as SourceGraphic.

        Note: If this option is used, then some implementations might need to rasterize the graphics elements in order
        to extract the alpha channel.

    BackgroundImage
        This keyword represents the back drop defined by the current isolation group behind the filter region at the
        time that the filter element was invoked. See isolation property [COMPOSITING].

    BackgroundAlpha
        Same as BackgroundImage except only the alpha channel is used.
        See SourceAlpha and the isolation property [COMPOSITING].

    FillPaint
        This keyword represents the value of the fill property on the target element for the filter effect.
        The FillPaint image has conceptually infinite extent.
        Frequently this image is opaque everywhere, but it might not be if the "paint" itself has alpha, as in the case
        of a gradient or pattern which itself includes transparent or semi-transparent parts.
        If fill references a paint server, then the coordinate space of the paint server is the coordinate space defined
        for the filtered object. E.g if the paint server requires to use the objectBoundingBox of the object, the object
        bounding box of the filtered object defines the reference size of the paint server. If the paint server requires
        to use the userSpaceOnUse, the nearest viewport in the user coordinate system of the filtered object defines the
        reference size of the paint server.

    StrokePaint
        This keyword represents the value of the stroke property on the target element for the filter effect.
        The StrokePaint image has conceptually infinite extent. See FillPaint above for more details.
        Animatable: yes.

 */

export default props => {
    const { x, y, width, height, result, children } = props;
    return {
        x,
        y,
        width,
        height,
        result,
        children,
    };
};
