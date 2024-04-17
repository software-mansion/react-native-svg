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

import { getOffset, getTransform } from '../common/SVGCommon';
import { SVGViewCommon, SVGViewRawCommon } from '../common/SVGType';
import { SVGImageDescriptor, SVGImageDescriptorWrapper } from '../components/SVGImage';

export class SVGImageModifier implements AttributeModifier<ImageAttribute> {
  private constructor() {
  }

  private static instance: SVGImageModifier;
  protected descriptor: SVGImageDescriptor = Object() as SVGImageDescriptor;
  protected descriptorWrapper: SVGImageDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewRawCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGImageModifier {
    if (!SVGImageModifier.instance) {
      SVGImageModifier.instance = new SVGImageModifier();
    }
    return SVGImageModifier.instance;
  }

  setDescriptor(descriptor: SVGImageDescriptor,
                descriptorWrapper: SVGImageDescriptorWrapper | undefined,
                svgViewCommon: SVGViewRawCommon | undefined): SVGImageModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue;
    }
    return SVGImageModifier.instance;
  }

  applyNormalAttribute(instance: ImageAttribute): void {
    instance.autoResize(true);

    if (this.descriptor.props.width !== '0') {
      instance.width(this.descriptor.props.width);
    }

    if (this.descriptor.props.height !== '0') {
      instance.height(this.descriptor.props.height);
    }

    instance.position(getOffset(this.descriptor.props.x, this.descriptor.props.y));

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    // if (this.descriptor.props.matrix?.length === 6) {
    //   instance.transform(getTransform(this.descriptor.props.matrix));
    // }
    if(this.descriptor.props.combineMetrics) {
      instance.transform(this.descriptor.props.combineMetrics)
    } else if (this.descriptor.props.matrix?.length === 6) {
      instance.transform(getTransform(this.descriptor.props.matrix));
    }

  }
}