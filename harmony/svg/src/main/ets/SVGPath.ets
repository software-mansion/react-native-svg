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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANT KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Descriptor, RNOHContext } from 'rnoh'
import Logger from './common/log/Logger'
import { getColor, getScaleX, getScaleY, getSvgViewTag, getTransform } from './common/SVGCommon'
import { getViewDescriptor } from './common/SVGTempCache'
import { SVGPathProps } from './common/SVGType'
import { SVGViewDescriptor } from './SVGView'

export const SVG_PATH_TYPE_NAME: string = "RNSVGPath"

export type SVGPathDescriptor = Descriptor<"RNSVGPath", SVGPathProps>

@Component
export struct SVGPath {
  ctx!: RNOHContext
  tag: number = 0
  @State descriptor: SVGPathDescriptor = {} as SVGPathDescriptor
  @State scaleValue: number = 1
  private unregisterDescriptorChangesListener?: () => void = undefined
  private vp2pxValue: number = vp2px(1)

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGPathDescriptor)
      }
    )
    Logger.debug("RNOH SVGPath", JSON.stringify(this.descriptor))
    this.initScale()
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  initScale() {
    let viewDescriptor: SVGViewDescriptor | undefined = getViewDescriptor(getSvgViewTag(this.descriptor?.parentTag))
    if (viewDescriptor) {
      this.scaleValue = Math.min(getScaleX(viewDescriptor), getScaleY(viewDescriptor)) * this.vp2pxValue
    }
  }

  getStrokeWidth(strokeWidth?: string) {
    return strokeWidth ? Number(strokeWidth) / this.vp2pxValue : 0
  }

  build() {
    Path()
      .antiAlias(true)
      .commands(this.descriptor.props.d)
      .position(this.descriptor.layoutMetrics.frame.origin)
      .fill(getColor(this.descriptor.props.fill?.payload))
      .fillOpacity(this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0)
      .stroke(getColor(this.descriptor.props.stroke?.payload))
      .strokeWidth(this.getStrokeWidth(this.descriptor.props.strokeWidth))
      .strokeLineCap(this.descriptor.props.strokeLinecap)
      .transform(getTransform(this.descriptor.props.matrix, this.scaleValue))
      .scale({ x: this.scaleValue, y: this.scaleValue, centerX: 0, centerY: 0 })
    // .width("100%")
    // .height("100%")
  }
}