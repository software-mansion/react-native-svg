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
import {
  getColor,
  getRawColor,
  getRawFillOpacity,
  getGradient,
  getStrokeLineCap,
  getStrokeLineJoin,
  getStrokeWidth,
  getTransform,
  calculateOffset,
} from '../common/SVGCommon';
import { SVGViewCommon, SVGViewRawCommon, SVGOffset } from '../common/SVGType';
import { SVGLinearGradientValue } from '../common/SVGLinearGradient';
import { getMaskDescriptor } from '../common/SVGTempCache';
import { convertColorValueToColorSegments } from '@rnoh/react-native-openharmony';

export class SVGPathModifier implements AttributeModifier<PathAttribute> {
  private constructor() {
  }

  private static instance: SVGPathModifier;
  protected descriptor: SVGPathDescriptor = Object() as SVGPathDescriptor;
  protected descriptorWrapper: SVGPathDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewRawCommon | undefined = undefined;
  private scaleValue: number = 1;
  private defaultScaleValue: number = vp2px(1);
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
                svgViewCommon: SVGViewRawCommon | undefined): SVGPathModifier {
    this.descriptor = descriptor;
    this.descriptorWrapper = descriptorWrapper;
    this.svgViewCommon = svgViewCommon;
    if (svgViewCommon?.scaleValue) {
      this.scaleValue = svgViewCommon.scaleValue * vp2px(1);
      this.percentage = 100 / this.scaleValue + '%';
    }
    this.gradient = getGradient(this.descriptor.props.fill);
    return SVGPathModifier.instance;
  }

  applyNormalAttribute(instance: PathAttribute): void {
    instance.position(this.descriptor.layoutMetrics.frame.origin);

    if (this.svgViewCommon) {
      const groupBox = this.svgViewCommon.groupBox
      const svgWidth = this.svgViewCommon.svgWidth
      const svgHeight = this.svgViewCommon.svgHeight
      if ((svgWidth / svgHeight) != (groupBox.width / groupBox.height)) {
        const offset: SVGOffset = calculateOffset(svgWidth, svgHeight, groupBox.width, groupBox.height)
        instance.translate({
          x : `${offset.x as number / this.svgViewCommon.scaleValue}`,
          y: `${offset.y as number / this.svgViewCommon.scaleValue }`,
        })
      }
    }

    if (this.descriptor.props.d) {
      instance.commands(this.descriptor.props.d);
    } else {
      // 规避首次空路径，再更新路径后path不显示问题
      instance.commands('M 50,100');
      instance.opacity(0);
      return
    }

    if (JSON.stringify(convertColorValueToColorSegments(this.descriptor?.rawProps.fill?.payload)) !== '[0,0,0,1]') {
      instance.fill(getRawColor(this.descriptor.rawProps.fill?.payload));
    }

    // let fillOpacity = this.descriptor.rawProps.fill?.payload ? this.descriptor.props.fillOpacity : 0
    let fillOpacity = getRawFillOpacity(this.descriptor.rawProps.fill, this.descriptor.props.fillOpacity)
    if (fillOpacity !== 1) {
      instance.fillOpacity(fillOpacity);
    }

    if (this.descriptor.props.stroke?.payload) {
      instance.stroke(getColor(this.descriptor.props.stroke?.payload));

      if (getStrokeWidth(this.descriptor.props.strokeWidth, this.defaultScaleValue) !== 1) {
        instance.strokeWidth(getStrokeWidth(this.descriptor.props.strokeWidth, this.defaultScaleValue));
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
    } else {
      instance.strokeWidth(0);
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

    instance.scale({ x: this.defaultScaleValue, y: this.defaultScaleValue, centerX: 0, centerY: 0 });

    if (this.gradient) {
      instance.width(this.svgViewCommon?.svgWidth ? this.svgViewCommon?.svgWidth / this.scaleValue : this.percentage);
      instance.height(this.svgViewCommon?.svgHeight ? this.svgViewCommon?.svgHeight / this.scaleValue : this.percentage);
      instance.linearGradient(this.gradient);
      instance.clip(new Path({
        width: '100%',
        height: '100%',
        commands: this.descriptor.props.d }));
    }

    if (this.descriptor.props.mask) {
      instance.commands(this.descriptor.props.d.replace(new RegExp("[-+]?\\d+(\\.\\d+)?", "g"),
        match => vp2px(parseFloat(match)).toString()))
      instance.scale({ x: 1, y: 1, centerX: 0, centerY: 0 })
      let maskDescriptor = getMaskDescriptor(this.descriptor.props.mask)
      if (maskDescriptor) {
        instance.mask(maskDescriptor)
      }
    }
  }
}