/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  BorderMetrics,
  convertColorSegmentsToString,
  convertColorValueToColorSegments,
  Descriptor,
  getTransformedVector,
  LayoutDirectionRN,
  OverflowMode,
  resolveBorderMetrics,
  RNOHContext,
  TransformMatrix
} from '@rnoh/react-native-openharmony';
import matrix4 from '@ohos.matrix4';
import { SVGViewDescriptor, SVGViewDescriptorWrapper } from '../SVGView';

export class SVGViewModifier implements AttributeModifier<StackAttribute> {
  private constructor() {
  }

  private static instance: SVGViewModifier;
  protected descriptor: SVGViewDescriptor = Object() as SVGViewDescriptor;
  protected descriptorWrapper: SVGViewDescriptorWrapper | undefined = undefined

  public static getInstance(): SVGViewModifier {
    if (!SVGViewModifier.instance) {
      SVGViewModifier.instance = new SVGViewModifier();
    }
    return SVGViewModifier.instance;
  }

  setDescriptor(descriptor: SVGViewDescriptor, descriptorWrapper: SVGViewDescriptorWrapper | undefined): SVGViewModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    return SVGViewModifier.instance;
  }

  getHitTestMode() {
    switch (this.descriptorWrapper?.pointerEvents) {
      case "none":
        return HitTestMode.None
      case "box-none":
        return HitTestMode.None
      case "box-only":
        return HitTestMode.Block
      default:
        return HitTestMode.Default
    }
  }

  getBorderStyle(): BorderStyle {
    switch (this.descriptorWrapper?.borderStyle) {
      case "dashed":
        return BorderStyle.Dashed
      case "dotted":
        return BorderStyle.Dotted
      default:
        return BorderStyle.Solid
    }
  }

  getTransform(): undefined | matrix4.Matrix4Transit {
    const descriptorWrapper = this.descriptorWrapper
    if (!descriptorWrapper) {
      return undefined
    }
    const rawTransformationMatrix = descriptorWrapper.rawTransformationMatrix.slice()
    rawTransformationMatrix[12] = vp2px(rawTransformationMatrix[12]);
    rawTransformationMatrix[13] = vp2px(rawTransformationMatrix[13]);
    rawTransformationMatrix[14] = vp2px(rawTransformationMatrix[14]);
    return matrix4.init(rawTransformationMatrix as TransformMatrix)
  }

  applyNormalAttribute(instance: StackAttribute): void {
    instance.width(this.descriptorWrapper?.width);
    instance.height(this.descriptorWrapper?.height);
    instance.position(this.descriptorWrapper?.positionRelativeToParent);

    if (this.descriptorWrapper?.backgroundColor) {
      instance.backgroundColor(this.descriptorWrapper?.backgroundColor)
    }
    if (this.descriptorWrapper?.borderWidth) {
      instance.borderWidth(this.descriptorWrapper?.borderWidth)
    }
    if (this.descriptorWrapper?.borderColor) {
      instance.borderColor(this.descriptorWrapper?.borderColor)
    }
    if (this.descriptorWrapper?.borderRadius) {
      instance.borderRadius(this.descriptorWrapper?.borderRadius)
    }
    if (this.descriptorWrapper?.borderStyle === 'dashed' || this.descriptorWrapper?.borderStyle === 'dotted') {
      instance.borderStyle(this.getBorderStyle())
    }
    if (this.descriptorWrapper?.opacity) {
      instance.opacity(this.descriptorWrapper?.opacity)
    }
    if (JSON.stringify(this.descriptorWrapper?.rawTransformationMatrix) !== '[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]') {
      instance.transform(this.getTransform())
    }

    // if (this.descriptorWrapper?.isClipping) {
    //   instance.clip(this.descriptorWrapper?.isClipping)
    // }
    let hitTestBehavior: HitTestMode = this.getHitTestMode();
    if (hitTestBehavior !== HitTestMode.Default) {
      instance.hitTestBehavior(hitTestBehavior)
    }
    if (this.descriptorWrapper?.shadow) {
      instance.shadow(this.descriptorWrapper?.shadow)
    }
    // instance.clip(new Rect({ width: '100%', height: '100%' }))
    instance.clip(true)
  }
}