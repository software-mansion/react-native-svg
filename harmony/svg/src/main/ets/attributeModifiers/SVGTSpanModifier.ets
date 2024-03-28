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

import { SVGViewCommon, SVGViewRawCommon, } from '../common/SVGType';
import { SVGTSpanDescriptor, SVGTSpanDescriptorWrapper } from '../components/SVGTSpan';

export class SVGTSpanModifier implements AttributeModifier<SpanAttribute> {
  private constructor() {
  }

  private static instance: SVGTSpanModifier;
  protected descriptor: SVGTSpanDescriptor = Object() as SVGTSpanDescriptor;
  protected descriptorWrapper: SVGTSpanDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewRawCommon | undefined = undefined;

  public static getInstance(): SVGTSpanModifier {
    if (!SVGTSpanModifier.instance) {
      SVGTSpanModifier.instance = new SVGTSpanModifier();
    }
    return SVGTSpanModifier.instance;
  }

  setDescriptor(descriptor: SVGTSpanDescriptor,
                descriptorWrapper: SVGTSpanDescriptorWrapper | undefined,
                svgViewCommon: SVGViewRawCommon | undefined): SVGTSpanModifier {
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