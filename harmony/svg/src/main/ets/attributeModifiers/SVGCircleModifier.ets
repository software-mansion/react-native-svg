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
import { convertColorValueToColorSegments } from '@rnoh/react-native-openharmony';

import {
  getColor,
  getFillOpacity,
  getRawColor,
  getRawFillOpacity,
  getStrokeLineCap,
  getStrokeLineJoin,
  getStrokeWidth,
  getTransform
} from '../common/SVGCommon';
import { getMaskDescriptor } from '../common/SVGTempCache';
import { SVGViewCommon, SVGViewRawCommon } from '../common/SVGType';
import { SVGCircleDescriptor, SVGCircleDescriptorWrapper } from '../components/SVGCircle';

export class SVGCircleModifier implements AttributeModifier<CircleAttribute> {
  private constructor() {
  }

  private static instance: SVGCircleModifier;
  protected descriptor: SVGCircleDescriptor = Object() as SVGCircleDescriptor;
  protected descriptorWrapper: SVGCircleDescriptorWrapper | undefined = undefined;
  protected svgViewCommon: SVGViewRawCommon | undefined = undefined;
  private scaleValue: number = 1;

  public static getInstance(): SVGCircleModifier {
    if (!SVGCircleModifier.instance) {
      SVGCircleModifier.instance = new SVGCircleModifier();
    }
    return SVGCircleModifier.instance;
  }

  setDescriptor(descriptor: SVGCircleDescriptor,
                descriptorWrapper: SVGCircleDescriptorWrapper | undefined,
                svgViewCommon: SVGViewRawCommon | undefined): SVGCircleModifier {
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

    // if (this.descriptor.props.matrix?.length === 6) {
    //   instance.transform(getTransform(this.descriptor.props.matrix));
    // }
    if(this.descriptor.props.combineMetrics) {
      instance.transform(this.descriptor.props.combineMetrics)
    } else if (this.descriptor.props.matrix?.length === 6) {
        instance.transform(getTransform(this.descriptor.props.matrix));
    }

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