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

import { Tag, RNOHContext, Descriptor } from '@rnoh/react-native-openharmony'
import { SVG_PATH_TYPE_NAME, SVGPathDescriptor } from "../components/SVGPath"
import { SVG_RECT_TYPE_NAME, SVGRectDescriptor } from "../components/SVGRect"
import { SVG_IMAGE_TYPE_NAME, SVGImageDescriptor } from "../components/SVGImage"
import { SVG_LINEAR_GRADIENT_TYPE_NAME, SVGLinearGradientDescriptor } from "./SVGLinearGradient"
import { SVGClipPathObj, SVGClipPathProps, SVGRectProps } from './SVGType'
import Logger from './log/Logger'
import { getRadius } from './SVGCommon'
import { setClipPathDescriptor } from './SVGTempCache'

export const SVG_CLIP_PATH_TYPE_NAME: string = "RNSVGClipPath"

export type SVGClipPathDescriptor = Descriptor<"RNSVGClipPath", SVGClipPathProps>

let descriptor: SVGClipPathDescriptor = {} as SVGClipPathDescriptor

export function SVGClipPathFactory(ctx: RNOHContext, tag: number): void {
  descriptor = ctx.descriptorRegistry.getDescriptor<SVGClipPathDescriptor>(tag)
  if (descriptor.props.name && descriptor) {
    let key: string = descriptor.props.name
    descriptor.childrenTags.forEach((childrenTag) => {
      Logger.debug("RNOH SVGClipPathFactory childrenTag=", JSON.stringify(childrenTag))
      componentProcessing(ctx, childrenTag, key)
    })
  }
}

function componentProcessing(ctx: RNOHContext, tag: Tag, key: string) {
  let type: string = ctx.descriptorRegistry.getDescriptor(tag).type
  if (type === SVG_RECT_TYPE_NAME) {
    let descriptorTemp: SVGRectDescriptor = ctx.descriptorRegistry.getDescriptor<SVGRectDescriptor>(tag)
    let value: SVGClipPathObj = { type, tag, value: new Rect({
      width: '100%',
      height: '100%',
      radiusWidth: getRadius(descriptorTemp.props.rx, descriptorTemp.props.ry),
      radiusHeight: getRadius(descriptorTemp.props.ry, descriptorTemp.props.rx)
    }) }
    Logger.debug("RNOH SVGRect componentProcessing", JSON.stringify(value))
    setClipPathDescriptor(key, value)
  }
  // else if (type === SVG_PATH_TYPE_NAME) {
  //   let descriptorTemp: SVGPathDescriptor = ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(tag)
  // } else if (type === SVG_IMAGE_TYPE_NAME) {
  //   let descriptorTemp: SVGImageDescriptor = ctx.descriptorRegistry.getDescriptor<SVGImageDescriptor>(tag)
  // } else if (type === SVG_LINEAR_GRADIENT_TYPE_NAME) {
  //   let descriptorTemp: SVGLinearGradientDescriptor = ctx.descriptorRegistry.getDescriptor<SVGLinearGradientDescriptor>(tag)
  // }
}