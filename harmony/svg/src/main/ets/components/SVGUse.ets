import { Descriptor, RNOHContext, Tag } from "@rnoh/react-native-openharmony";
import { SVGUseModifier } from "../attributeModifiers/SVGUseModifier";
import { getDefsDescriptor } from "../common/SVGTempCache";
import { SVGUseProps, SVGState, SVGBaseRawProps } from "../common/SVGType";
import { svgComponentFactoryBuilder } from "../SVGComponentFactory";

export const SVG_USE_TYPE_NAME = "RNSVGUse";

export type SVGUseDescriptor = Descriptor<"RNSVGUse", SVGUseProps, SVGState, SVGBaseRawProps>;

@Component
export struct SVGUse {
  ctx!: RNOHContext;
  tag: number = 0;
  @State descriptor: SVGUseDescriptor = {} as SVGUseDescriptor;
  private href: string | undefined;

  aboutToAppear(): void {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGUseDescriptor>(this.tag);
    this.href = this.descriptor.props.href;
  }

  getDescriptorByHref(href?: string): Descriptor | undefined {
    if (!href) {
      throw new Error("href must be a valid value!");
    }
    return getDefsDescriptor(href);
  }

  getElementTags(): Tag[] {
    let tags: Tag[] = [];
    const currentDescriptor = this.getDescriptorByHref(this.href);
    if (!currentDescriptor) return tags;
    const childrenTags = currentDescriptor.childrenTags;
    if (childrenTags && (childrenTags.length != 0)) {
      tags = childrenTags;
    } else {
      tags.push(currentDescriptor.tag);
    }
    return tags;
  }

  build() {
    Column() {
      ForEach(this.descriptor.childrenTags, (childrenTag: Tag) => {
        svgComponentFactoryBuilder(
          this.ctx,
          childrenTag,
          this.ctx.rnInstance.getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(childrenTag)?.type)
        )
      },(childrenTag:Tag) => childrenTag.toString())
      Shape(){
        ForEach(this.getElementTags(), (childrenTag: Tag) => {
          svgComponentFactoryBuilder(
            this.ctx,
            childrenTag,
            this.ctx.rnInstance.getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(childrenTag)?.type)
          )
        },(childrenTag:Tag) => childrenTag.toString())
      }.attributeModifier(SVGUseModifier.getInstance().setDescriptor(this.descriptor))
    }
  }
}
