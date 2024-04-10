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
import { SVGCircleDescriptor, SVG_CIRCLE_TYPE_NAME } from '../components/SVGCircle'
import { SVG_LINEAR_GRADIENT_TYPE_NAME, SVGLinearGradient } from "./SVGLinearGradient"
import { SVG_CLIP_PATH_TYPE_NAME, SVGClipPathFactory } from './SVGClipPathFactory'
import { setDefsDescriptor } from './SVGTempCache'
import { SVGBaseProps, SVGDefsProps } from './SVGType'
import Logger from './log/Logger'
import { SVGMask, SVG_Mask_TYPE_NAME } from './SVGMask'
import { SVGGroupDescriptor, SVG_GROUP_TYPE_NAME } from '../components/SVGGroup'

export const SVG_DEFS_TYPE_NAME: string = "RNSVGDefs"

export type SVGDefsDescriptor = Descriptor<"RNSVGDefs", SVGDefsProps>

// export function SVGDefsFactory(ctx: RNOHContext, tag: number): void {
//   const descriptor = ctx.descriptorRegistry.getDescriptor(tag)
//   if (descriptor) {
//     descriptor.childrenTags.forEach((childrenTag) => {
//       Logger.debug("RNOH SVGDefsFactory childrenTag=", JSON.stringify(childrenTag))
//       componentProcessing(ctx, childrenTag)
//     })
//   }
// }

export function SVGDefsFactory(ctx: RNOHContext, tag: number) {
  const descriptor: Descriptor<"", SVGBaseProps> = ctx.descriptorRegistry.getDescriptor(tag);
  if (descriptor?.childrenTags && (descriptor?.childrenTags.length != 0)) {
    for (const childTag of descriptor.childrenTags) {
      SVGDefsFactory(ctx, childTag);
    }
  }
  if (!descriptor.props.name) {
    return;
  }
  componentProcessing(ctx, tag);
}

function componentProcessing(ctx: RNOHContext, tag: Tag) {
  let type: string = ctx.descriptorRegistry.getDescriptor(tag).type
  if (type === SVG_PATH_TYPE_NAME) {
    let descriptorTemp: SVGPathDescriptor = ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(tag)
    storageDefsDescriptor(descriptorTemp.props.name, descriptorTemp)
  } else if (type === SVG_RECT_TYPE_NAME) {
    let descriptorTemp: SVGRectDescriptor = ctx.descriptorRegistry.getDescriptor<SVGRectDescriptor>(tag)
    storageDefsDescriptor(descriptorTemp.props.name, descriptorTemp)
  } else if (type === SVG_IMAGE_TYPE_NAME) {
    let descriptorTemp: SVGImageDescriptor = ctx.descriptorRegistry.getDescriptor<SVGImageDescriptor>(tag)
    storageDefsDescriptor(descriptorTemp.props.name, descriptorTemp)
  } else if (type === SVG_CIRCLE_TYPE_NAME) {
    let descriptorTemp: SVGCircleDescriptor = ctx.descriptorRegistry.getDescriptor<SVGCircleDescriptor>(tag)
    storageDefsDescriptor(descriptorTemp.props.name, descriptorTemp)
  } else if (type === SVG_LINEAR_GRADIENT_TYPE_NAME) {
    SVGLinearGradient(ctx, tag)
  } else if (type === SVG_GROUP_TYPE_NAME) {
    let descriptorTemp: SVGGroupDescriptor = ctx.descriptorRegistry.getDescriptor<SVGGroupDescriptor>(tag);
    storageDefsDescriptor(descriptorTemp.props.name, descriptorTemp)
  } else if (type === SVG_CLIP_PATH_TYPE_NAME) {
    SVGClipPathFactory(ctx, tag)
  } else if (type === SVG_Mask_TYPE_NAME) {
    SVGMask(ctx, tag)
  }
}

function storageDefsDescriptor(key?: string, value?: Descriptor) {
  if (key && value) {
    setDefsDescriptor(key, value)
  }
}