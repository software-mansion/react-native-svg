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

import { Descriptor, RNOHContext, ViewDescriptorWrapperBase } from '@rnoh/react-native-openharmony'
import { ImageLoaderTurboModule } from '@rnoh/react-native-openharmony/src/main/ets/RNOHCorePackage/turboModules';
import { SVGImageModifier } from '../attributeModifiers/SVGImageModifier';
import Logger from '../common/log/Logger';
import { SVGImageProps, SVGViewCommon, SVGViewRawCommon, SVGBaseRawProps, SVGState } from '../common/SVGType'
import { RemoteImageLoaderError } from '@rnoh/react-native-openharmony/src/main/ets/RemoteImageLoader/RemoteImageLoaderError';

export const SVG_IMAGE_TYPE_NAME: string = "RNSVGImage"

export type SVGImageDescriptor = Descriptor<"RNSVGImage", SVGImageProps, SVGState, SVGBaseRawProps>

export class SVGImageDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGImage", SVGImageProps> {
}

class ImageSourceHolder {
  public source: string | Resource | PixelMap

  constructor(source: string | Resource | PixelMap) {
    this.source = source
  }
}

@Component
export struct SVGImage {
  ctx!: RNOHContext
  tag: number = 0
  @Consume svgViewCommon: SVGViewRawCommon | undefined
  @State descriptor: SVGImageDescriptor = {} as SVGImageDescriptor
  @State descriptorWrapper: SVGImageDescriptorWrapper | undefined = undefined
  @State imageSource: ImageSourceHolder | undefined = undefined
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGImageDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.updateImageSource();
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.descriptor = newDescriptor as SVGImageDescriptor
      this.setDescriptorWrapper(this.descriptor)
      this.updateImageSource();
    })
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDescriptorWrapper(descriptor: SVGImageDescriptor) {
    this.descriptorWrapper = new SVGImageDescriptorWrapper(descriptor)
    Logger.debug("RNOH SVGImage", JSON.stringify(this.descriptor))
  }

  updateImageSource() {
    const uri = this.descriptor.props.src;
    if (uri.startsWith("asset://")) {
      this.imageSource = new ImageSourceHolder($rawfile(uri.replace("asset://", "assets/")));
      return;
    }
    if (uri.startsWith("data:")) {
      this.imageSource = new ImageSourceHolder(uri);
      return;
    }
    const imageLoader = this.ctx.rnInstance.getTurboModule<ImageLoaderTurboModule>("ImageLoader");
    this.imageSource = undefined;
    imageLoader.getRemoteImageSource(uri).then(async (remoteImage) => {
      try {
        const imageSource = remoteImage.getImageSource();
        const frameCounter = await imageSource.getFrameCount();
        if (frameCounter === 1) {
          // use the downloaded or cached image source
          this.imageSource = new ImageSourceHolder(await imageLoader.getPixelMap(uri));
        } else {
          // an animated GIF
          this.imageSource = new ImageSourceHolder(remoteImage.getLocation())
        }
      } catch (error) {
        this.dispatchOnError(error.message);
      }
    }).catch((error: RemoteImageLoaderError) => {
      this.dispatchOnError(error.message)
    })
  }

  dispatchOnError(message?: string) {
    const errorMessage = message ? message : "Failed to load the image";
    this.ctx.rnInstance.emitComponentEvent(this.descriptor.tag, "error", errorMessage)
  }

  build() {
    Image(this.imageSource?.source)
      .attributeModifier(SVGImageModifier.getInstance()
        .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon))
  }
}