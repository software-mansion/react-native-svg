
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
