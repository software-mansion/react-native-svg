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

import { Descriptor, RNOHContext, } from 'rnoh'
import Logger from './common/log/Logger'
import { getColor, getOffset, getTransform } from './common/SVGCommon'
import { NumberProp, FontWeight, SVGTextProps, SVGTSpanProps } from './common/SVGType'

export const SVG_TEXT_TYPE_NAME: string = "RNSVGText"

export type SVGTextDescriptor = Descriptor<"RNSVGText", SVGTextProps>

export const SVG_TSPAN_TYPE_NAME: string = "RNSVGTSpan"

export type SVGTSpanDescriptor = Descriptor<"RNSVGTSpan", SVGTSpanProps>

@Component
export struct SVGText {
  ctx!: RNOHContext
  tag: number = 0
  @State descriptor: SVGTextDescriptor = {} as SVGTextDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTextDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGTextDescriptor)
      }
    )
    Logger.debug("RNOH SVGText", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  getChildrenDescriptors() {
    let childrenDescriptors: SVGTSpanDescriptor[] = []
    for (let i = 0; i < this.descriptor.childrenTags.length; i++) {
      let tSpanDescriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTSpanDescriptor>(this.descriptor.childrenTags[i])
      // console.info("RNOH SVGText tSpan Descriptor", JSON.stringify(tSpanDescriptor))
      childrenDescriptors.push(tSpanDescriptor)
    }
    return childrenDescriptors
  }

  getFontSize(fontSize: NumberProp) {
    let textFontSize = this.descriptor.props.font?.fontSize
    return fontSize ? fontSize : textFontSize ? textFontSize : 16
  }

  getFontWeight(fontWeight: FontWeight) {
    let textFontWeight = this.descriptor.props.font?.fontWeight
    return fontWeight ? fontWeight : textFontWeight ? textFontWeight : 400
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
    Text() {
      ForEach(this.getChildrenDescriptors(), (tSpanDescriptor: SVGTSpanDescriptor) => {
        Span(tSpanDescriptor.props.content)
          .fontSize(this.getFontSize(tSpanDescriptor.props.font?.fontSize))
          .fontWeight(this.getFontWeight(tSpanDescriptor.props.font?.fontWeight))
		  .opacity(tSpanDescriptor.props.opacity)
        // .fontColor(getColor(tSpanDescriptor.props.fill?.payload))
      })
    }
    .position(this.getOffset(this.descriptor.props?.x, this.descriptor.props?.y))
    .fontColor(getColor(this.descriptor.props.fill?.payload))
    .fontSize(this.descriptor.props.font?.fontSize)
    .fontWeight(this.descriptor.props.font?.fontWeight)
    .textAlign(this.getTextAlign(this.descriptor.props.font?.textAnchor))
	.opacity(this.descriptor.props.opacity)
	.transform(getTransform(this.descriptor.props.matrix))
  }
}