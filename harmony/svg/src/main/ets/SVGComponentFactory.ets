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

import { Descriptor, ComponentBuilderContext, RNOHContext, Tag, RNComponentFactory } from '@rnoh/react-native-openharmony'
import { SVGGroup, SVG_GROUP_TYPE_NAME } from './components/SVGGroup'
import { SVGPath, SVG_PATH_TYPE_NAME } from './components/SVGPath'
import { SVGRect, SVG_RECT_TYPE_NAME } from './components/SVGRect'
import { SVGImage, SVG_IMAGE_TYPE_NAME } from './components/SVGImage'
import { SVGText, SVG_TEXT_TYPE_NAME } from './components/SVGText'
import { SVGCircle, SVG_CIRCLE_TYPE_NAME } from './components/SVGCircle'
import { SVGEllipse, SVG_ELLIPSE_TYPE_NAME } from './components/SVGEllipse'
import { SVGViewCommon } from './common/SVGType'
import { SVG_Mask_TYPE_NAME } from './common/SVGMask'
import { SVGUse, SVG_USE_TYPE_NAME } from './components/SVGUse'

export type CustomComponentBuilder = (ctx: ComponentBuilderContext) => void

export class BuilderProxy {
  public static buildCustomComponent: CustomComponentBuilder
}

@Component
export struct SVGComponentFactory {
  public ctx!: RNOHContext
  public tag: number = 0
  public svgViewCommon: SVGViewCommon | undefined = undefined
  @BuilderParam public buildCustomComponent!: CustomComponentBuilder
  @State private componentName: string = ''
  @State private childrenTags: Tag[] = []
  private cleanupCallback?: () => void = undefined

  aboutToAppear() {
    const descriptor = this.ctx.descriptorRegistry.getDescriptor<Descriptor>(this.tag)
    if (descriptor) {
      this.setDescriptor(descriptor)
    }
    this.cleanupCallback = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(
      this.tag, (newDescriptor) => this.setDescriptor(newDescriptor)
    )
  }

  aboutToDisappear() {
    this.cleanupCallback?.()
  }

  setDescriptor(newDescriptor: Descriptor) {
    this.componentName = newDescriptor.type
    this.childrenTags = newDescriptor.childrenTags
  }

  build() {
    if (this.componentName === SVG_GROUP_TYPE_NAME) {
      SVGGroup({
        ctx: this.ctx,
        tag: this.tag,
        buildCustomComponent: this.buildCustomComponent
      })
    } else if (this.componentName === SVG_PATH_TYPE_NAME) {
      SVGPath({ ctx: this.ctx, tag: this.tag })
    } else if (this.componentName === SVG_RECT_TYPE_NAME) {
      SVGRect({ ctx: this.ctx, tag: this.tag })
    } else if (this.componentName === SVG_IMAGE_TYPE_NAME) {
      SVGImage({ ctx: this.ctx, tag: this.tag })
    } else if (this.componentName === SVG_TEXT_TYPE_NAME) {
      SVGText({ ctx: this.ctx, tag: this.tag })
    } else if (this.componentName === SVG_CIRCLE_TYPE_NAME) {
      SVGCircle({ ctx: this.ctx, tag: this.tag })
    }
    // else if (this.componentName === SVG_ELLIPSE_TYPE_NAME) {
    //   SVGEllipse({ ctx: this.ctx, tag: this.tag })
    // }
  }
}

@Builder
export function svgComponentFactoryBuilder(ctx: RNOHContext, tag: Tag, componentName: string) {
  if (componentName === SVG_GROUP_TYPE_NAME) {
    SVGGroup({
      ctx: ctx,
      tag: tag,
      buildCustomComponent: BuilderProxy.buildCustomComponent
    })
  } else if (componentName === SVG_PATH_TYPE_NAME) {
    SVGPath({ ctx: ctx, tag: tag })
  } else if (componentName === SVG_RECT_TYPE_NAME) {
    SVGRect({ ctx: ctx, tag: tag })
  } else if (componentName === SVG_IMAGE_TYPE_NAME) {
    SVGImage({ ctx: ctx, tag: tag })
  } else if (componentName === SVG_TEXT_TYPE_NAME) {
    SVGText({ ctx: ctx, tag: tag })
  } else if (componentName === SVG_USE_TYPE_NAME) {
    SVGUse({ ctx: ctx, tag: tag })
  } else if (componentName === SVG_CIRCLE_TYPE_NAME) {
    SVGCircle({ ctx: ctx, tag: tag })
  }
  // else if (componentName === SVG_ELLIPSE_TYPE_NAME) {
  //   SVGEllipse({ ctx: ctx, tag: tag })
  // }
  else if (componentName === SVG_Mask_TYPE_NAME) {
  }
  else if (componentName !== '') {
    RNComponentFactory({ ctx: ctx, tag: tag, buildCustomComponent: BuilderProxy.buildCustomComponent })
  }

}

