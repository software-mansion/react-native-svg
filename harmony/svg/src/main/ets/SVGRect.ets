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
import { getOffset, getTransform, getColor } from './common/SVGCommon'
import { SVGRectProps } from './common/SVGType'

export const SVG_RECT_TYPE_NAME: string = "RNSVGRect"

export type SVGRectDescriptor = Descriptor<"RNSVGRect", SVGRectProps>

@Component
export struct SVGRect {
  ctx!: RNOHContext
  tag: number = 0
  @State descriptor: SVGRectDescriptor = {} as SVGRectDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGRectDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGRectDescriptor)
      }
    )
    Logger.debug("RNOH SVGRect", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  build() {
    Rect()
      .width(this.descriptor.props.width)
      .height(this.descriptor.props.height)
      .position(this.descriptor.layoutMetrics.frame.origin)
      .fill(getColor(this.descriptor.props.fill?.payload))
      .fillOpacity(this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0)
      .stroke(getColor(this.descriptor.props.stroke?.payload))
      .strokeWidth(this.descriptor.props.strokeWidth)
      .offset(getOffset(this.descriptor.props.x, this.descriptor.props.y))
      .radiusWidth(this.descriptor.props.rx ?? 0)
      .radiusHeight(this.descriptor.props.ry ?? 0)
      .transform(getTransform(this.descriptor.props.matrix))
  }
}