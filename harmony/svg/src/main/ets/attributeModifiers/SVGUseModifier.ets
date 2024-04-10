import { convertColorValueToColorSegments } from '@rnoh/react-native-openharmony';
import { getColor, getRawColor } from "../common/SVGCommon";
import { SVGUseDescriptor } from "../components/SVGUse";


export class SVGUseModifier implements AttributeModifier<ShapeAttribute> {
  static instance: SVGUseModifier;
  descriptor: SVGUseDescriptor | undefined = undefined;

  static getInstance() {
    if (!SVGUseModifier.instance) {
      SVGUseModifier.instance = new SVGUseModifier();
    }
    return SVGUseModifier.instance;
  }

  setDescriptor(descriptor: SVGUseDescriptor) {
    this.descriptor = descriptor;
    return SVGUseModifier.instance;
  }

  applyNormalAttribute(instance: ShapeAttribute): void {
    instance.width("100%");
    instance.height("100%");
    if (this.descriptor?.props.opacity) {
      instance.opacity(this.descriptor?.props.opacity);
    }

    if (this.descriptor?.props.x || this.descriptor?.props.y) {
      instance.padding({ left: this.descriptor?.props.x, top: this.descriptor?.props.y });
    }

    if (JSON.stringify(convertColorValueToColorSegments(this.descriptor?.rawProps.fill?.payload)) !== '[0,0,0,1]') {
      instance.fill(getRawColor(this.descriptor?.rawProps.fill?.payload));
    }

    if (this.descriptor?.props.fillOpacity) {
      instance.fillOpacity(this.descriptor?.props.fillOpacity);
    }

    if(this.descriptor?.props.stroke?.payload){
      instance.stroke(getColor(this.descriptor?.props.stroke?.payload));
    }

    if(this.descriptor?.props.strokeWidth){
      instance.strokeWidth(this.descriptor?.props.strokeWidth);
    }

    if(this.descriptor?.props.strokeOpacity && this.descriptor?.props.stroke?.payload){
      instance.strokeOpacity(this.descriptor?.props.strokeOpacity);
    }
  }
}