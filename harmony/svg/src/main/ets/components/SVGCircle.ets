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

import { Descriptor, RNOHContext, ViewDescriptorWrapperBase } from '@rnoh/react-native-openharmony'
import { SVGCircleModifier } from '../attributeModifiers/SVGCircleModifier'
import Logger from '../common/log/Logger';
import { getColor, getRawColor, getFillOpacity, getRawFillOpacity, getGradient, getOffset, getStrokeWidth, getTransform } from '../common/SVGCommon';
import { SVGLinearGradientValue } from '../common/SVGLinearGradient';
import { getMaskDescriptor } from '../common/SVGTempCache';
import { SVGCircleProps, SVGViewCommon, SVGViewRawCommon, SVGBaseRawProps, SVGState } from '../common/SVGType'

export const SVG_CIRCLE_TYPE_NAME: string = "RNSVGCircle"

export type SVGCircleDescriptor = Descriptor<"RNSVGCircle", SVGCircleProps, SVGState, SVGBaseRawProps>

export class SVGCircleDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGCircle", SVGCircleProps> {
}

@Component
export struct SVGCircle {
  ctx!: RNOHContext
  tag: number = 0
  @Consume svgViewCommon: SVGViewRawCommon | undefined
  @State descriptor: SVGCircleDescriptor = {} as SVGCircleDescriptor
  @State descriptorWrapper: SVGCircleDescriptorWrapper | undefined = undefined
  @State scaleValue: number = 1
  @State gradient: SVGLinearGradientValue | undefined = undefined
  @State diameter: number = 0
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGCircleDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGCircleDescriptor)
        this.setDescriptorWrapper(this.descriptor)
        Logger.debug("RNOH SVGCircle New", JSON.stringify(this.descriptor))
      }
    )
    Logger.debug("RNOH SVGCircle", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDescriptorWrapper(descriptor: SVGCircleDescriptor) {
    this.descriptorWrapper = new SVGCircleDescriptorWrapper(descriptor)
    if (this.svgViewCommon?.scaleValue) {
      this.scaleValue = this.svgViewCommon.scaleValue;
    }
    this.gradient = getGradient(this.descriptor.props.fill)
  }

  build() {
    Circle()
      .width(this.getDiameter())
      .height(this.getDiameter())
      .fill(getRawColor(this.descriptor.rawProps.fill?.payload))
      .fillOpacity(getRawFillOpacity(this.descriptor.rawProps.fill, this.descriptor.props.fillOpacity))
      .stroke(getColor(this.descriptor.props.stroke?.payload))
      .strokeWidth(getStrokeWidth(this.descriptor.props.strokeWidth))
      .opacity(this.descriptor.props.opacity)
      .transform(this.descriptor.props.combineMetrics)
      .position(getOffset(this.getCenterX(), this.getCenterY()))
      .linearGradient(this.gradient)
      .clip(this.getLinearGradientClip())
      .mask(this.descriptor.props.mask ? getMaskDescriptor(this.descriptor.props.mask) : undefined)

    // Circle还不支持attributeModifier
    // .attributeModifier(SVGCircleModifier.getInstance()
    //   .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))
  }

  getDiameter() {
    return Number(this.descriptor.props.r) * 2
  }

  getCenterX() {
    return Number(this.descriptor.props.cx) - Number(this.descriptor.props.r)
  }

  getCenterY() {
    return Number(this.descriptor.props.cy) - Number(this.descriptor.props.r)
  }

  getLinearGradientClip() {
    if (this.gradient) {
      return new Circle({
        width: '100%',
        height: '100%'
      })
    }
    return undefined
  }
}