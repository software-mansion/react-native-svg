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

import { SVGPathDescriptor, SVGPathDescriptorWrapper } from '../components/SVGPath';
import { getColor, getStrokeWidth, getTransform } from '../common/SVGCommon';
import { SVGViewCommon } from '../common/SVGType';
import { SVGLinearGradientValue } from '../common/SVGLinearGradient';
import { getDefsDescriptor, getMaskDescriptor } from '../common/SVGTempCache';

export class SVGPathModifier implements AttributeModifier<PathAttribute> {
  private constructor() {
  }

  private static instance: SVGPathModifier;
  protected descriptor: SVGPathDescriptor = Object() as SVGPathDescriptor;
  protected descriptorWrapper: SVGPathDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewCommon | undefined = undefined;
  private scaleValue: number = 1;
  private percentage: string = '100%';
  private gradient: SVGLinearGradientValue | undefined = undefined;

  public static getInstance(): SVGPathModifier {
    if (!SVGPathModifier.instance) {
      SVGPathModifier.instance = new SVGPathModifier();
    }
    return SVGPathModifier.instance;
  }

  setDescriptor(descriptor: SVGPathDescriptor,
                descriptorWrapper: SVGPathDescriptorWrapper | undefined,
                svgViewCommon: SVGViewCommon | undefined): SVGPathModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
      this.percentage = 100 / this.scaleValue + '%';
    }
    this.getGradient();
    return SVGPathModifier.instance;
  }

  applyNormalAttribute(instance: PathAttribute): void {
    instance.position(this.descriptor.layoutMetrics.frame.origin);

    if (this.descriptor.props.d) {
      instance.commands(this.descriptor.props.d);
    } else {
      // 规避首次空路径，再更新路径后path不显示问题
      instance.commands('M 50,100');
      instance.opacity(0);
      return
    }

    let fill = getColor(this.descriptor.props.fill?.payload)
    if (fill && fill !== '[0,0,0,1]') {
      instance.fill(fill);
    }

    let fillOpacity = this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0
    if (fillOpacity !== 1) {
      instance.fillOpacity(fillOpacity);
    }

    instance.stroke(getColor(this.descriptor.props.stroke?.payload));

    if (getStrokeWidth(this.descriptor.props.strokeWidth) !== 1) {
      instance.strokeWidth(getStrokeWidth(this.descriptor.props.strokeWidth));
    }

    // instance.strokeLineCap(this.descriptor.props.strokeLinecap);

    if (this.descriptor.props.opacity !== 1) {
      instance.opacity(this.descriptor.props.opacity);
    }

    instance.transform(getTransform(this.descriptor.props.matrix, this.scaleValue));

    instance.scale({ x: this.scaleValue, y: this.scaleValue, centerX: 0, centerY: 0 });

    if (this.gradient) {
      instance.width(this.svgViewCommon?.svgWidth ? this.svgViewCommon?.svgWidth / this.scaleValue : this.percentage);
      instance.height(this.svgViewCommon?.svgHeight ? this.svgViewCommon?.svgHeight / this.scaleValue : this.percentage);
      instance.linearGradient(this.gradient);
      instance.clip(this.getClip());
    }
    if (this.descriptor.props.mask) {
      let maskDescriptor = getMaskDescriptor(this.descriptor.props.mask)
      if (maskDescriptor) {
        instance.mask(maskDescriptor)
      }
    }
  }

  getGradient() {
    if (this.descriptor.props.fill?.type == 1) {
      this.gradient = getDefsDescriptor(this.descriptor.props.fill?.brushRef) as SVGLinearGradientValue
    } else {
      this.gradient = undefined
    }
  }

  getClip() {
    return new Path({
      width: '100%',
      height: '100%',
      commands: this.descriptor.props.d });
  }
}