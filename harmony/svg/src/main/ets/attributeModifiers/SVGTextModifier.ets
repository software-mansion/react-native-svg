import { getColor, getOffset, getTransform } from '../common/SVGCommon';
import { SVGViewCommon } from '../common/SVGType';
import { SVGTextDescriptor, SVGTextDescriptorWrapper } from '../components/SVGText';

export class SVGTextModifier implements AttributeModifier<TextAttribute> {
  private constructor() {
  }

  private static instance: SVGTextModifier;
  protected descriptor: SVGTextDescriptor = Object() as SVGTextDescriptor;
  protected descriptorWrapper: SVGTextDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGTextModifier {
    if (!SVGTextModifier.instance) {
      SVGTextModifier.instance = new SVGTextModifier();
    }
    return SVGTextModifier.instance;
  }

  setDescriptor(descriptor: SVGTextDescriptor,
                descriptorWrapper: SVGTextDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGTextModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
    }
    return SVGTextModifier.instance;
  }

  applyNormalAttribute(instance: TextAttribute): void {
    instance.position(this.getOffset(this.descriptor.props.x, this.descriptor.props.y));

    instance.fontColor(getColor(this.descriptor.props.fill?.payload));

    if (this.descriptor.props.font?.fontSize) {
      instance.fontSize(this.descriptor.props.font?.fontSize);
    }

    if (this.descriptor.props.font?.fontWeight) {
      instance.fontWeight(this.descriptor.props.font?.fontWeight);
    }

    if (this.descriptor.props.font?.textAnchor) {
      instance.textAlign(this.getTextAlign(this.descriptor.props.font?.textAnchor));
    }

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix));
  }

  getOffset(x?: string[], y?: string[]) {
    let x1 = x ? x[0] : '0'
    let y1 = y ? y[0] : '0'
    return getOffset(x1, y1)
  }

  getTextAlign(textAnchor?: string) {
    switch (textAnchor) {
      case 'start':
        return TextAlign.Start
      case 'middle':
        return TextAlign.Center
      case 'end':
        return TextAlign.End
      default:
        return TextAlign.Start
    }
  }
}