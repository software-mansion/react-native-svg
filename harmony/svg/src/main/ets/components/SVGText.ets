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

import { Descriptor, RNOHContext, Tag, ViewDescriptorWrapperBase } from '@rnoh/react-native-openharmony'
import { SVGTextModifier } from '../attributeModifiers/SVGTextModifier'
import Logger from '../common/log/Logger'
import { getOffset } from '../common/SVGCommon'
import { NumberProp, FontWeight, SVGTextProps, SVGViewCommon, SVGViewRawCommon, SVGState, SVGBaseRawProps, } from '../common/SVGType'
import { SVGTSpan, SVGTSpanDescriptor } from './SVGTSpan'

export const SVG_TEXT_TYPE_NAME: string = "RNSVGText"

export type SVGTextDescriptor = Descriptor<"RNSVGText", SVGTextProps, SVGState, SVGBaseRawProps>

export class SVGTextDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGText", SVGTextProps> {
}

export const SVG_TSPAN_TYPE_NAME: string = "RNSVGTSpan"

@Component
export struct SVGText {
  ctx!: RNOHContext
  tag: number = 0
  @Consume svgViewCommon: SVGViewRawCommon | undefined
  @State descriptor: SVGTextDescriptor = {} as SVGTextDescriptor
  @State descriptorWrapper: SVGTextDescriptorWrapper | undefined = undefined
  private unregisterDescriptorChangesListener?: () => void = undefined
  @State private childrenTags: Tag[] = []

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTextDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.descriptor = newDescriptor as SVGTextDescriptor
      this.setDescriptorWrapper(this.descriptor)
      Logger.debug("RNOH SVGText New", JSON.stringify(this.descriptor))
    })
    Logger.debug("RNOH SVGText", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDescriptorWrapper(descriptor: SVGTextDescriptor) {

    this.descriptorWrapper = new SVGTextDescriptorWrapper(descriptor)
    this.childrenTags = descriptor.childrenTags;
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

  getChildrenDescriptors() {
    let childrenDescriptors: SVGTSpanDescriptor[] = []
    for (let i = 0; i < this.descriptor.childrenTags.length; i++) {
      let tSpanDescriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTSpanDescriptor>(this.descriptor.childrenTags[i])
      childrenDescriptors.push(tSpanDescriptor)
    }
    return childrenDescriptors
  }

  build() {
    Text() {
      ForEach(this.getChildrenDescriptors(), (tSpanDescriptor: SVGTSpanDescriptor) => {
        Span(tSpanDescriptor.props.content)
          .fontSize(this.getFontSize(tSpanDescriptor.props.font?.fontSize))
          .fontWeight(this.getFontWeight(tSpanDescriptor.props.font?.fontWeight))
          .opacity(tSpanDescriptor.props.opacity)
      })
    }
    .attributeModifier(SVGTextModifier.getInstance()
      .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))
  }
}