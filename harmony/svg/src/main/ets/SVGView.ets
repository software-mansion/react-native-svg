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
  Descriptor,
  ComponentBuilderContext,
  RNComponentFactory,
  RNOHContext,
  RNViewBase,
  Tag,
} from 'rnoh'
import Logger from './common/log/Logger'
import { getScaleX, getScaleY } from './common/SVGCommon'
import { setViewDescriptor } from './common/SVGTempCache'
import { SVGViewProps } from './common/SVGType'

export const SVG_VIEW_TYPE_NAME: string = "RNSVGSvgView"

export type SVGViewDescriptor = Descriptor<"RNSVGSvgView", SVGViewProps>

@Component
export struct SVGView {
  ctx!: RNOHContext
  tag: number = 0
  @BuilderParam buildCustomComponent: (ctx: ComponentBuilderContext) => void
  @State descriptor: SVGViewDescriptor = {} as SVGViewDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGViewDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGViewDescriptor)
		setViewDescriptor(this.tag, this.descriptor)
      }
    )
    setViewDescriptor(this.tag, this.descriptor)
    Logger.debug("RNOH SVGView", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  scaleValue() {
    return Math.min(getScaleX(this.descriptor), getScaleY(this.descriptor))
  }

  build() {
    RNViewBase({
      ctx: this.ctx,
      tag: this.tag,
    }) {
      Stack() {
        ForEach(this.descriptor.childrenTags, (tag: Tag) => {
          RNComponentFactory({ ctx: this.ctx, tag: tag, buildCustomComponent: this.buildCustomComponent })
        }, (tag: Tag) => tag.toString())
      }
      .width("100%")
      .height("100%")
      .offset({
        x: -(this.descriptor.props?.minX * this.scaleValue() || 0),
        y: -(this.descriptor.props?.minY * this.scaleValue() || 0)
      })
    }
  }
}
