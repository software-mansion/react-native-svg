import { getColor, getTransform } from '../common/SVGCommon';
import { SVGViewCommon } from '../common/SVGType';
import { SVGCircleDescriptor, SVGCircleDescriptorWrapper } from '../components/SVGCircle';

export class SVGCircleModifier implements AttributeModifier<CircleAttribute> {
  private constructor() {
  }

  private static instance: SVGCircleModifier;
  protected descriptor: SVGCircleDescriptor = Object() as SVGCircleDescriptor;
  protected descriptorWrapper: SVGCircleDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGCircleModifier {
    if (!SVGCircleModifier.instance) {
      SVGCircleModifier.instance = new SVGCircleModifier();
    }
    return SVGCircleModifier.instance;
  }

  setDescriptor(descriptor: SVGCircleDescriptor,
                descriptorWrapper: SVGCircleDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGCircleModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
    }
    return SVGCircleModifier.instance;
  }

  applyNormalAttribute(instance: CircleAttribute): void {
    if (this.descriptor.props.r) {
      let diameter = this.getDiameter();
      instance.width(diameter);
      instance.height(diameter);
    }

    instance.position(this.descriptor.layoutMetrics.frame.origin);

    let fill = getColor(this.descriptor.props.fill?.payload)
    if (fill && fill !== '[0,0,0,1]') {
      instance.fill(fill);
    }

    let fillOpacity = this.getFillOpacity()
    if (fillOpacity !== 1) {
      instance.fillOpacity(fillOpacity);
    }

    if (this.descriptor.props.stroke?.payload) {
      instance.stroke(getColor(this.descriptor.props.stroke?.payload));
    }

    if (this.getStrokeWidth(this.descriptor.props.strokeWidth) !== 1) {
      instance.strokeWidth(this.getStrokeWidth(this.descriptor.props.strokeWidth));
    }

    // instance.strokeLineCap(this.descriptor.props.strokeLinecap);

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix));
  }

  getDiameter() {
    return Number(this.descriptor.props.r) * 2
  }

  getStrokeWidth(strokeWidth?: string) {
    return strokeWidth ? Number(strokeWidth) : 0
  }

  getFillOpacity() {
    if (this.descriptor.props.fill?.payload) {
      return this.descriptor.props.fill?.payload[3] == 0 ? 0 : this.descriptor.props.fillOpacity
    }
    return 0
  }
}