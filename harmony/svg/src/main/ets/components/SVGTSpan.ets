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

import { Descriptor, RNOHContext,ViewDescriptorWrapperBase } from '@rnoh/react-native-openharmony'
import { SVGTSpanModifier } from '../attributeModifiers/SVGTSpanModifier'
import Logger from '../common/log/Logger'
import { getOffset } from '../common/SVGCommon'
import { NumberProp, FontWeight, SVGTSpanProps, SVGViewCommon, SVGViewRawCommon, SVGState, SVGBaseRawProps, } from '../common/SVGType'

export const SVG_TSPAN_TYPE_NAME: string = "RNSVGTSpan"

export type SVGTSpanDescriptor = Descriptor<"RNSVGTSpan", SVGTSpanProps, SVGState, SVGBaseRawProps>

export class SVGTSpanDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGTSpan", SVGTSpanProps> {
}

@Component
export struct SVGTSpan {
  ctx!: RNOHContext
  tag: number = 0
  @State svgViewCommon: SVGViewRawCommon | undefined = undefined
  @State descriptor: SVGTSpanDescriptor = {} as SVGTSpanDescriptor
  @State descriptorWrapper: SVGTSpanDescriptorWrapper | undefined = undefined
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTSpanDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.descriptor = newDescriptor as SVGTSpanDescriptor
      this.setDescriptorWrapper(this.descriptor)
      Logger.debug("RNOH SVGTSpan New", JSON.stringify(this.descriptor))
    })
    Logger.debug("RNOH SVGTSpan", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDescriptorWrapper(descriptor: SVGTSpanDescriptor) {
    this.descriptorWrapper = new SVGTSpanDescriptorWrapper(descriptor)
  }

  getChildrenDescriptor() {
    let childrenDescriptors: SVGTSpanDescriptor[] = []
    for (let i = 0; i < this.descriptor.childrenTags.length; i++) {
      let tSpanDescriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTSpanDescriptor>(this.descriptor.childrenTags[i])
      childrenDescriptors.push(tSpanDescriptor)
    }
    return childrenDescriptors
  }

  getFontSize(fontSize?: NumberProp) {
    let textFontSize = this.descriptor.props.font?.fontSize
    return fontSize ? fontSize : (textFontSize ? textFontSize : 16)
  }

  getFontWeight(fontWeight?: FontWeight) {
    let textFontWeight = this.descriptor.props.font?.fontWeight
    return fontWeight ? fontWeight : (textFontWeight ? textFontWeight : 400)
  }

  getTextAlign(textAnchor?: string) {
    switch (textAnchor) {
      case 'start':
        return TextAlign.Start
      case 'middle':
        return TextAlign.Center
      case 'end':
        return TextAlign.End
      default:
        return TextAlign.Start
    }
  }

  getOffset(x?: string[], y?: string[]) {
    let x1 = x ? x[0] : '0'
    let y1 = y ? y[0] : '0'
    return getOffset(x1, y1)
  }

  build() {
    Span(this.descriptor.props.content)
      .attributeModifier(SVGTSpanModifier.getInstance()
        .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))
  }
}