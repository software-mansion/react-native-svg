import { getColor, getOffset, getRadius, getStrokeWidth, getTransform } from '../common/SVGCommon';
import { SVGClipPathObj, SVGViewCommon } from '../common/SVGType';
import { getClipPathDescriptor } from '../common/SVGTempCache';
import Logger from '../common/log/Logger';
import { SVGRectDescriptor, SVGRectDescriptorWrapper } from '../components/SVGRect';
import { SVGImageDescriptor, SVGImageDescriptorWrapper } from '../components/SVGImage';

export class SVGImageModifier implements AttributeModifier<ImageAttribute> {
  private constructor() {
  }

  private static instance: SVGImageModifier;
  protected descriptor: SVGImageDescriptor = Object() as SVGImageDescriptor;
  protected descriptorWrapper: SVGImageDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGImageModifier {
    if (!SVGImageModifier.instance) {
      SVGImageModifier.instance = new SVGImageModifier();
    }
    return SVGImageModifier.instance;
  }

  setDescriptor(descriptor: SVGImageDescriptor,
                descriptorWrapper: SVGImageDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGImageModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
    }
    return SVGImageModifier.instance;
  }

  applyNormalAttribute(instance: ImageAttribute): void {
    instance.autoResize(true);

    if (this.descriptor.props.width !== '0') {
      instance.width(this.descriptor.props.width);
    }

    if (this.descriptor.props.height !== '0') {
      instance.width(this.descriptor.props.height);
    }

    instance.position(getOffset(this.descriptor.props.x, this.descriptor.props.y));

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix));
  }
}