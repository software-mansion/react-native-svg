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

import { Descriptor, RNOHContext, RNViewManager, ViewDescriptorWrapperBase } from 'rnoh'
import Logger from '../common/log/Logger'
import { SVGPathProps, SVGViewCommon } from '../common/SVGType'
import { SVGLinearGradientValue } from '../common/SVGLinearGradient'
import emitter from '@ohos.events.emitter';
import { SVGPathModifier } from '../attributeModifiers/SVGPathModifier'

export const SVG_PATH_TYPE_NAME: string = "RNSVGPath"

export type SVGPathDescriptor = Descriptor<"RNSVGPath", SVGPathProps>

export class SVGPathDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGPath", SVGPathProps> {
}

@Component
export struct SVGPath {
  ctx!: RNOHContext
  tag: number = 0
  @State svgViewCommon: SVGViewCommon | undefined = undefined
  @State descriptor: SVGPathDescriptor = {} as SVGPathDescriptor
  @State descriptorWrapper: SVGPathDescriptorWrapper | undefined = undefined
  @State scaleValue: number = 1
  @State gradient: SVGLinearGradientValue | undefined = undefined
  @State gradientEnable: boolean = false
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.descriptor = newDescriptor as SVGPathDescriptor
      this.setDescriptorWrapper(this.descriptor)


      Logger.debug("RNOH SVGPath New", JSON.stringify(this.descriptor))
    })
    Logger.debug("RNOH SVGPath", JSON.stringify(this.descriptor)) // this.getEmitterData()

  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.() // emitter.off(this.svgViewCommon.svgTag)
  }

  setDescriptorWrapper(descriptor: SVGPathDescriptor) {
    this.descriptorWrapper = new SVGPathDescriptorWrapper(descriptor)
  }

  getEmitterData() {
    if (!this.svgViewCommon.svgTag) {
      return
    }
    let innerEvent: emitter.InnerEvent = { eventId: this.svgViewCommon.svgTag }
    emitter.on(innerEvent, () => {
      Logger.debug("RNOH SVGPath emitter 接收", JSON.stringify(innerEvent))
      this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(this.tag)
    })
  }

  build() {
    Path()
      .attributeModifier(SVGPathModifier.getInstance()
        .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))

    // .commands(this.descriptor.props.d)
    // .position(this.getOrigin())
    // .fill(getColor(this.descriptor.props.fill?.payload))
    // .fillOpacity(this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0)
    // .stroke(getColor(this.descriptor.props.stroke?.payload))
    // .strokeWidth(this.getStrokeWidth(this.descriptor.props.strokeWidth))
    // .strokeLineCap(this.descriptor.props.strokeLinecap)
    // .opacity(this.descriptor.props.opacity)
    // .transform(getTransform(this.descriptor.props.matrix, this.scaleValue))
    // .scale({ x: this.scaleValue, y: this.scaleValue, centerX: 0, centerY: 0 })
    // .linearGradient(this.getLinearGradient())
    // .clip(this.getClip())
  }
}