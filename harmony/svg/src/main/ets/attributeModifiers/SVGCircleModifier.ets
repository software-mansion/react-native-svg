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
  getColor,
  getFillOpacity,
  getStrokeLineCap,
  getStrokeLineJoin,
  getStrokeWidth,
  getTransform
} from '../common/SVGCommon';
import { getMaskDescriptor } from '../common/SVGTempCache';
import { SVGViewCommon } from '../common/SVGType';
import { SVGCircleDescriptor, SVGCircleDescriptorWrapper } from '../components/SVGCircle';

export class SVGCircleModifier implements AttributeModifier<CircleAttribute> {
  private constructor() {
  }

  private static instance: SVGCircleModifier;
  protected descriptor: SVGCircleDescriptor = Object() as SVGCircleDescriptor;
  protected descriptorWrapper: SVGCircleDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGCircleModifier {
    if (!SVGCircleModifier.instance) {
      SVGCircleModifier.instance = new SVGCircleModifier();
    }
    return SVGCircleModifier.instance;
  }

  setDescriptor(descriptor: SVGCircleDescriptor,
                descriptorWrapper: SVGCircleDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGCircleModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue;
    }
    return SVGCircleModifier.instance;
  }

  applyNormalAttribute(instance: CircleAttribute): void {
    if (this.descriptor.props.r) {
      let diameter = this.getDiameter();
      instance.width(diameter);
      instance.height(diameter);
    }

    instance.position(this.descriptor.layoutMetrics.frame.origin);

    if (JSON.stringify(this.descriptor?.props.fill?.payload) !== '[0,0,0,1]') {
      instance.fill(getColor(this.descriptor.props.fill?.payload));
    }

    let fillOpacity = getFillOpacity(this.descriptor.props.fill, this.descriptor.props.fillOpacity)
    if (fillOpacity !== 1) {
      instance.fillOpacity(fillOpacity);
    }

    instance.stroke(getColor(this.descriptor.props.stroke?.payload));
    if (this.descriptor.props.stroke?.payload) {
      if (getStrokeWidth(this.descriptor.props.strokeWidth) !== 1) {
        instance.strokeWidth(getStrokeWidth(this.descriptor.props.strokeWidth));
      }

      if (this.descriptor.props.strokeDasharray?.length !== 0) {
        instance.strokeDashArray(this.descriptor.props.strokeDasharray);
      }

      if (this.descriptor.props.strokeDashoffset !== 0) {
        instance.strokeDashOffset(this.descriptor.props.strokeDashoffset);
      }

      if (getStrokeLineCap(this.descriptor.props.strokeLinecap) !== LineCapStyle.Butt) {
        instance.strokeLineCap(getStrokeLineCap(this.descriptor.props.strokeLinecap));
      }

      if (getStrokeLineJoin(this.descriptor.props.strokeLinejoin) !== LineJoinStyle.Miter) {
        instance.strokeLineJoin(getStrokeLineJoin(this.descriptor.props.strokeLinejoin));
      }

      if (this.descriptor.props.strokeMiterlimit !== 0) {
        instance.strokeMiterLimit(this.descriptor.props.strokeMiterlimit);
      }
    }

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix));

    instance.scale({ x: this.scaleValue, y: this.scaleValue, centerX: 0, centerY: 0 });

    if (this.descriptor.props.mask) {
      let maskDescriptor = getMaskDescriptor(this.descriptor.props.mask)
      if (maskDescriptor) {
        instance.mask(maskDescriptor)
      }
    }
  }

  getDiameter() {
    return Number(this.descriptor.props.r) * 2
  }
}