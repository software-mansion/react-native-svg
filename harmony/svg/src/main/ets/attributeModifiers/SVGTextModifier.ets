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

import { getColor, getRawColor, getOffset, getTransform } from '../common/SVGCommon';
import { SVGViewCommon, SVGViewRawCommon } from '../common/SVGType';
import { SVGTextDescriptor, SVGTextDescriptorWrapper } from '../components/SVGText';

export class SVGTextModifier implements AttributeModifier<TextAttribute> {
  private constructor() {
  }

  private static instance: SVGTextModifier;
  protected descriptor: SVGTextDescriptor = Object() as SVGTextDescriptor;
  protected descriptorWrapper: SVGTextDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewRawCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGTextModifier {
    if (!SVGTextModifier.instance) {
      SVGTextModifier.instance = new SVGTextModifier();
    }
    return SVGTextModifier.instance;
  }

  setDescriptor(descriptor: SVGTextDescriptor,
                descriptorWrapper: SVGTextDescriptorWrapper | undefined,
                svgViewCommon: SVGViewRawCommon | undefined): SVGTextModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue;
    }
    return SVGTextModifier.instance;
  }

  applyNormalAttribute(instance: TextAttribute): void {
    instance.position(this.getOffset(this.descriptor.props.x, this.descriptor.props.y));

    instance.fontColor(getRawColor(this.descriptor.rawProps.fill?.payload));

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

    // if (this.descriptor.props.matrix?.length === 6) {
    //   instance.transform(getTransform(this.descriptor.props.matrix));
    // }
    if(this.descriptor.props.combineMetrics) {
      instance.transform(this.descriptor.props.combineMetrics)
    }
    else if (this.descriptor.props.matrix?.length === 6) {
      instance.transform(getTransform(this.descriptor.props.matrix));
    }
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