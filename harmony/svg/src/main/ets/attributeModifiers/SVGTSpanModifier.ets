import { SVGViewCommon } from '../common/SVGType';
import { SVGTSpanDescriptor, SVGTSpanDescriptorWrapper } from '../components/SVGTSpan';

export class SVGTSpanModifier implements AttributeModifier<SpanAttribute> {
  private constructor() {
  }

  private static instance: SVGTSpanModifier;
  protected descriptor: SVGTSpanDescriptor = Object() as SVGTSpanDescriptor;
  protected descriptorWrapper: SVGTSpanDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;

  public static getInstance(): SVGTSpanModifier {
    if (!SVGTSpanModifier.instance) {
      SVGTSpanModifier.instance = new SVGTSpanModifier();
    }
    return SVGTSpanModifier.instance;
  }

  setDescriptor(descriptor: SVGTSpanDescriptor,
                descriptorWrapper: SVGTSpanDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGTSpanModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    return SVGTSpanModifier.instance;
  }

  applyNormalAttribute(instance: SpanAttribute): void {
    if (this.descriptor.props.font?.fontSize) {
      instance.fontSize(this.descriptor.props.font?.fontSize);
    }

    if (this.descriptor.props.font?.fontWeight) {
      instance.fontWeight(this.descriptor.props.font?.fontWeight);
    }

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }
  }
}