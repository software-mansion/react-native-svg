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

import { Descriptor, RNOHContext, ViewDescriptorWrapperBase } from 'rnoh'
import { SVGCircleModifier } from '../attributeModifiers/SVGCircleModifier'
import Logger from '../common/log/Logger';
import { SVGCircleProps, SVGViewCommon } from '../common/SVGType'

export const SVG_CIRCLE_TYPE_NAME: string = "RNSVGCircle"

export type SVGCircleDescriptor = Descriptor<"RNSVGCircle", SVGCircleProps>

export class SVGCircleDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGCircle", SVGCircleProps>{
}

@Component
export struct SVGCircle {
  ctx!: RNOHContext
  tag: number = 0
  @State svgViewCommon: SVGViewCommon | undefined = undefined
  @State descriptor: SVGCircleDescriptor = {} as SVGCircleDescriptor
  @State descriptorWrapper: SVGCircleDescriptorWrapper | undefined = undefined
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
  }

  build() {
    Circle()
      .attributeModifier(SVGCircleModifier.getInstance()
        .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))
      // .width(this.diameter)
      // .height(this.diameter)
      // .position(this.getOrigin())
      // .fill(getColor(this.descriptor.props.fill?.payload))
      // .fillOpacity(this.descriptor.props.fill?.payload ? this.descriptor.props.fillOpacity : 0)
      // .stroke(getColor(this.descriptor.props.fill?.payload))
      // .strokeWidth(this.getStrokeWidth(this.descriptor.props.strokeWidth))
      // .strokeLineCap(this.descriptor.props.strokeLinecap)
      // .opacity(this.descriptor.props.opacity)
      // .transform(getTransform(this.descriptor.props.matrix))
      // .scale({ centerX: this.descriptor.props.cx, centerY: this.descriptor.props.cy })
  }
}