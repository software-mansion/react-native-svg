import { getTransform } from '../common/SVGCommon';
import { SVGGroupDescriptor, SVGGroupDescriptorWrapper } from '../components/SVGGroup';
import { SVGViewCommon } from '../common/SVGType';
import { SVG_VIEW_TYPE_NAME } from '../SVGView';

export class SVGGroupModifier implements AttributeModifier<ShapeAttribute> {
  private constructor() {
  }

  private static instance: SVGGroupModifier;
  protected descriptor: SVGGroupDescriptor = Object() as SVGGroupDescriptor;
  protected descriptorWrapper: SVGGroupDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  protected parentType: string | undefined = undefined;

  public static getInstance(): SVGGroupModifier {
    if (!SVGGroupModifier.instance) {
      SVGGroupModifier.instance = new SVGGroupModifier();
    }
    return SVGGroupModifier.instance;
  }

  setDescriptor(descriptor: SVGGroupDescriptor,
                descriptorWrapper: SVGGroupDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined,
                parentType: string | undefined): SVGGroupModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    this.parentType = parentType;
    return SVGGroupModifier.instance;
  }

  applyNormalAttribute(instance: ShapeAttribute): void {
    if (this.parentType == SVG_VIEW_TYPE_NAME && this.svgViewCommon) {
      instance.width(this.svgViewCommon.groupBox.width);
      instance.height(this.svgViewCommon.groupBox.height);
    } else {
      instance.width('100%');
      instance.height('100%');
    }

    if (JSON.stringify(this.descriptor.props.matrix) !== '[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]') {
      instance.transform(getTransform(this.descriptor.props.matrix));
    }
  }
}