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
  RNOHContext,
  Tag,
  ColorSegments,
  RNViewManager,
  ViewDescriptorWrapperBase,
} from '@rnoh/react-native-openharmony'
import Logger from './common/log/Logger'
import { getGroupBox, getScaleValue } from './common/SVGCommon'
import { setViewDescriptor } from './common/SVGTempCache'
import { SVGViewCommon, SVGViewRawCommon, SVGViewProps, SVGState, SVGViewRawProps } from './common/SVGType'
import { svgComponentFactoryBuilder } from './SVGComponentFactory'
import { SVGViewModifier } from './attributeModifiers/SVGViewModifier'

export const SVG_VIEW_TYPE_NAME: string = "RNSVGSvgView"

export type SVGViewDescriptor = Descriptor<"RNSVGSvgView", SVGViewProps, SVGState, SVGViewRawProps>

export class SVGViewDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGSvgView", SVGViewProps> {
}

@Component
export struct SVGView {
  ctx!: RNOHContext
  tag: number = 0
  public componentManager!: RNViewManager;
  @State descriptor: SVGViewDescriptor = Object() as SVGViewDescriptor
  @State private descriptorWrapper: SVGViewDescriptorWrapper | undefined = undefined
  private unregisterDescriptorChangesListener?: () => void = undefined
  private unregisterComponentManager?: () => void = undefined
  private unregisterCommandCallback?: () => void = undefined
  @State private childrenTags: Tag[] = []
  @Provide svgViewCommon: SVGViewRawCommon | undefined = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGViewDescriptor>(this.tag)
    this.initComponent()
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.setDescriptorWrapper(newDescriptor as SVGViewDescriptor)
    })
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
    this.unregisterComponentManager?.()
    this.unregisterCommandCallback?.()
  }

  initComponent() {
    if (!this.componentManager) {
      this.componentManager = new RNViewManager(this.tag, this.ctx)
    }
    this.unregisterComponentManager = this.ctx.componentManagerRegistry.registerComponentManager(this.tag, this.componentManager)
    this.componentManager.setParentTag(this.descriptor.parentTag)
    this.setDescriptorWrapper(this.descriptor)
  }

  private setDescriptorWrapper(descriptor: SVGViewDescriptor) {
    this.descriptorWrapper = new SVGViewDescriptorWrapper(descriptor)
    this.childrenTags = descriptor.childrenTags;
    this.svgViewCommon = {
      svgTag: this.tag,
      scaleValue: getScaleValue(descriptor),
      groupBox: getGroupBox(descriptor),
      svgWidth: this.descriptorWrapper?.width,
      svgHeight: this.descriptorWrapper?.height,
      svgColor: descriptor.rawProps.color,
    }
    Logger.debug("RNOH SVGView svgViewCommon=", JSON.stringify(this.svgViewCommon))
    setViewDescriptor(this.tag, descriptor)
    Logger.debug("RNOH SVGView", JSON.stringify(descriptor))
  }

  build() {
    Stack() {
      ForEach(this.childrenTags, (childrenTag: Tag) => {
        svgComponentFactoryBuilder(
          this.ctx,
          childrenTag,
          this.ctx.rnInstance.getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(childrenTag)?.type))
      }, (childrenTags: Tag) => childrenTags.toString())
    }.attributeModifier(SVGViewModifier.getInstance().setDescriptor(this.descriptor, this.descriptorWrapper))
  }
}
