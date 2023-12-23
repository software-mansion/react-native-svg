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

import { getColor, getStrokeWidth, getTransform } from '../common/SVGCommon';
import { SVGViewCommon } from '../common/SVGType';
import { SVGEllipseDescriptor, SVGEllipseDescriptorWrapper } from '../components/SVGEllipse';

export class SVGEllipseModifier implements AttributeModifier<EllipseAttribute> {
  private constructor() {
  }

  private static instance: SVGEllipseModifier;
  protected descriptor: SVGEllipseDescriptor = Object() as SVGEllipseDescriptor;
  protected descriptorWrapper: SVGEllipseDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGEllipseModifier {
    if (!SVGEllipseModifier.instance) {
      SVGEllipseModifier.instance = new SVGEllipseModifier();
    }
    return SVGEllipseModifier.instance;
  }

  setDescriptor(descriptor: SVGEllipseDescriptor,
                descriptorWrapper: SVGEllipseDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGEllipseModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    return SVGEllipseModifier.instance;
  }

  applyNormalAttribute(instance: EllipseAttribute): void {
    if (this.descriptor.props.rx !== '0') {
      instance.width(this.getEllipseWidth());
    }

    if (this.descriptor.props.ry !== '0') {
      instance.height(this.getEllipseHeight());
    }

    instance.position(this.descriptor.layoutMetrics.frame.origin);

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
      instance.strokeWidth(getStrokeWidth(this.descriptor.props.strokeWidth));
    }

    // instance.strokeLineCap(this.descriptor.props.strokeLinecap);

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix));
  }

  getEllipseWidth() {
    return Number(this.descriptor.props.rx) * 2
  }

  getEllipseHeight() {
    return Number(this.descriptor.props.ry) * 2
  }

  getFillOpacity() {
    if (this.descriptor.props.fill?.payload) {
      return this.descriptor.props.fill?.payload[3] == 0 ? 0 : this.descriptor.props.fillOpacity
    }
    return 0
  }
}