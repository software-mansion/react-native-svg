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

import { getTransform } from '../common/SVGCommon';
import { SVGGroupDescriptor, SVGGroupDescriptorWrapper } from '../components/SVGGroup';
import { SVGViewCommon } from '../common/SVGType';
import { SVG_VIEW_TYPE_NAME } from '../SVGView';

export class SVGGroupModifier implements AttributeModifier<StackAttribute> {
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

  applyNormalAttribute(instance: StackAttribute): void {
    if (this.parentType == SVG_VIEW_TYPE_NAME && this.svgViewCommon) {
      instance.width(this.svgViewCommon.groupBox.width);
      instance.height(this.svgViewCommon.groupBox.height);

      if (this.svgViewCommon.groupBox.minX !== 0 || this.svgViewCommon.groupBox.minY !== 0) {
        instance.offset({
          x: -(this.svgViewCommon.groupBox.minX * this.svgViewCommon.scaleValue || 0),
          y: -(this.svgViewCommon.groupBox.minY * this.svgViewCommon.scaleValue || 0)
        })
      }

    } else {
      instance.width('100%');
      instance.height('100%');
    }

    //规避QRCODE-SVG logo偏移位置不在中心问题
    if (this.svgViewCommon.renderLogoTag === this.descriptor.tag &&
      (this.svgViewCommon.groupBox.minX !== 0 || this.svgViewCommon.groupBox.minY !== 0)) {
      instance.offset({
        x: this.svgViewCommon.groupBox.minX * this.svgViewCommon.scaleValue,
        y: this.svgViewCommon.groupBox.minY * this.svgViewCommon.scaleValue
      })
    }

    if (this.descriptor.props.matrix.length === 6) {
      instance.transform(getTransform(this.descriptor.props.matrix));
    }
  }
}