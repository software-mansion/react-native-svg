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

import { getColor, getOffset, getRadius, getStrokeWidth, getTransform } from '../common/SVGCommon';
import { SVGClipPathObj, SVGViewCommon } from '../common/SVGType';
import { getClipPathDescriptor, getMaskDescriptor } from '../common/SVGTempCache';
import Logger from '../common/log/Logger';
import { SVGRectDescriptor, SVGRectDescriptorWrapper } from '../components/SVGRect';

export class SVGRectModifier implements AttributeModifier<RectAttribute> {
  private constructor() {
  }

  private static instance: SVGRectModifier;
  protected descriptor: SVGRectDescriptor = Object() as SVGRectDescriptor;
  protected descriptorWrapper: SVGRectDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGRectModifier {
    if (!SVGRectModifier.instance) {
      SVGRectModifier.instance = new SVGRectModifier();
    }
    return SVGRectModifier.instance;
  }

  setDescriptor(descriptor: SVGRectDescriptor,
                descriptorWrapper: SVGRectDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGRectModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
    }
    return SVGRectModifier.instance;
  }

  applyNormalAttribute(instance: RectAttribute): void {
    if (this.descriptor.props.width !== '0') {
      instance.width(this.descriptor.props.width);
    }

    if (this.descriptor.props.height !== '0') {
      instance.height(this.descriptor.props.height);
    }

    instance.position(getOffset(this.descriptor.props.x, this.descriptor.props.y));

    let fill = getColor(this.descriptor.props.fill?.payload)
    if (fill && fill !== '[0,0,0,1]') {
      instance.fill(fill);
    }

    let fillOpacity = this.getFillOpacity()
    if (fillOpacity !== 1) {
      instance.fillOpacity(fillOpacity);
    }

    if (this.descriptor.props.stroke?.payload) {
      instance.stroke(getColor(this.descriptor.props.stroke?.payload));
    }

    if (getStrokeWidth(this.descriptor.props.strokeWidth) !== 1) {
      instance.strokeWidth(this.descriptor.props.strokeWidth);
    }

    // instance.strokeLineCap(this.descriptor.props.strokeLinecap);

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    if (getRadius(this.descriptor.props.rx, this.descriptor.props.ry) !== 1) {
      instance.radiusWidth(getRadius(this.descriptor.props.rx, this.descriptor.props.ry));
    }

    if (getRadius(this.descriptor.props.ry, this.descriptor.props.rx) !== 1) {
      instance.radiusHeight(getRadius(this.descriptor.props.ry, this.descriptor.props.rx));
    }

    instance.transform(getTransform(this.descriptor.props.matrix));

    if (this.descriptor.props.clipPath) {
      instance.clip(this.getClipPath());
    }
    if (this.descriptor.props.mask) {
      let maskDescriptor = getMaskDescriptor(this.descriptor.props.mask)
      if (maskDescriptor) {
        instance.mask(maskDescriptor)
      }
    }
  }

  getFillOpacity() {
    // Rect组件的fill [0,0,0,0] 无法显示透明，目前手动处理
    if (this.descriptor.props.fill?.payload) {
      Logger.debug("RNOH SVGRect payload", JSON.stringify(this.descriptor.props.fill?.payload[3]))
      return this.descriptor.props.fill?.payload[3] == 0 ? 0 : this.descriptor.props.fillOpacity
    }
    return 0
  }

  getClipPath() {
    if (!this.descriptor.props.clipPath) {
      return undefined
    }
    let clipPathObjTemp: object | undefined = getClipPathDescriptor(this.descriptor.props.clipPath)
    if (!clipPathObjTemp) {
      return undefined
    }
    let clipPathObj: SVGClipPathObj = clipPathObjTemp as SVGClipPathObj
    if (!(clipPathObj.type && clipPathObj.value)) {
      return undefined
    }
    if (clipPathObj?.type == 'RNSVGRect') {
      return clipPathObj.value as RectAttribute
    }
    return undefined
  }
}