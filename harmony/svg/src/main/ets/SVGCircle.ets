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

import { Descriptor, RNOHContext } from 'rnoh'
import Logger from './common/log/Logger';
import { getColor, getOffset, getTransform } from './common/SVGCommon'
import { SVGCircleProps } from './common/SVGType'

export const SVG_CIRCLE_TYPE_NAME: string = "RNSVGCircle"

export type SVGCircleDescriptor = Descriptor<"RNSVGCircle", SVGCircleProps>

@Component
export struct SVGCircle {
  ctx!: RNOHContext
  tag: number = 0
  svgTag: number = 0
  @State descriptor: SVGCircleDescriptor = {} as SVGCircleDescriptor
  @State diameter: number = 0
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGCircleDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGCircleDescriptor)
        this.setDiameter()
        Logger.debug("RNOH SVGCircle New", JSON.stringify(this.descriptor))
      }
    )
    this.setDiameter()
    Logger.debug("RNOH SVGCircle", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDiameter() {
    this.diameter = Number(this.descriptor.props.r) * 2
  }

  getOrigin() {
    return this.descriptor.props.layoutMetrics.frame.origin
  }

  getStrokeWidth(strockWidth?: string) {
    return strockWidth ? Number(strockWidth) : 0
  }

  build() {
    Circle()
      .width(this.diameter)
      .height(this.diameter)
      .position(this.getOrigin())
      .fill(getColor(this.descriptor.props.fill?.payload))
      .fillOpacity(this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0)
      .stroke(getColor(this.descriptor.props.fill?.payload))
      .strokeWidth(this.getStrokeWidth(this.descriptor.props.strokeWidth))
      .strokeLineCap(this.descriptor.props.strokeLinecap)
      .opacity(this.descriptor.props.opacity)
      .transform(getTransform(this.descriptor.props.matrix))
      .scale({ centerX: this.descriptor.props.cx, centerY: this.descriptor.props.cy })
  }
}