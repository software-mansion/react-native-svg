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
import { ImageLoaderTurboModule } from 'rnoh/src/main/ets/RNOHCorePackage/turboModules';
import Logger from './common/log/Logger';
import { getOffset, getTransform } from './common/SVGCommon'
import { SVGImageProps } from './common/SVGType'

export const SVG_IMAGE_TYPE_NAME: string = "RNSVGImage"

export type SVGImageDescriptor = Descriptor<"RNSVGImage", SVGImageProps>

@Component
export struct SVGImage {
  ctx!: RNOHContext
  tag: number = 0
  @State descriptor: SVGImageDescriptor = {} as SVGImageDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGImageDescriptor>(this.tag)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (newDescriptor) => {
        this.descriptor = (newDescriptor as SVGImageDescriptor)
      }
    )
    Logger.debug("RNOH SVGImage", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  getSource(source: string) {
    if (source.startsWith("asset://")) {
      return $rawfile(source.replace("asset://", "assets/"));
    }
    if (source.startsWith("file://assets/src/assets/")) {
      return $rawfile(source.replace("file://assets/src/assets/", "assets/"));
    }
    const filePath = this.ctx.rnInstance.getTurboModule<ImageLoaderTurboModule>("ImageLoader").getCachedImage(source)
    return filePath ?? source
  }

  build() {
    Image(this.getSource(this.descriptor.props.src))
      .width(this.descriptor.props.width)
      .height(this.descriptor.props.height)
      .autoResize(true)
      .position(this.descriptor.layoutMetrics.frame.origin)
      .opacity(this.descriptor.props.opacity)
      .transform(getTransform(this.descriptor.props.matrix))
      // .offset(getOffset(this.descriptor.props.x, this.descriptor.props.y))
  }
}