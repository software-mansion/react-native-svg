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
 *
 * SOFTWARE.
 */

import { Descriptor, RNOHContext, ComponentBuilderContext, Tag, ViewDescriptorWrapperBase,
  convertColorValueToColorSegments } from '@rnoh/react-native-openharmony'
import { SVGBaseProps, SVGBaseRawProps, SVGState, SVGGroupProps, SVGViewCommon, SVGViewRawCommon } from '../common/SVGType'
import { setDefsDescriptor, setGroupDescriptor } from '../common/SVGTempCache'
import { SVG_DEFS_TYPE_NAME, SVGDefsFactory } from '../common/SVGDefsFactory'
import Logger from '../common/log/Logger'
import { SVGPathDescriptor, SVG_PATH_TYPE_NAME } from './SVGPath'
import { SVGRectDescriptor, SVG_RECT_TYPE_NAME } from './SVGRect'
import { parseFill, parseRawFill, parseStroke } from '../common/SVGMergeProperties'
import { SVGTextDescriptor, SVG_TEXT_TYPE_NAME } from './SVGText'
import { SVGImageDescriptor, SVG_IMAGE_TYPE_NAME } from './SVGImage'
import { svgComponentFactoryBuilder } from '../SVGComponentFactory'
import { SVGCircleDescriptor, SVG_CIRCLE_TYPE_NAME } from './SVGCircle'
import { SVGGroupModifier } from '../attributeModifiers/SVGGroupModifier'
import { SVGMask, SVG_Mask_TYPE_NAME } from '../common/SVGMask'
import { getTransform } from '../common/SVGCommon'
import matrix4 from '@ohos.matrix4';

export const SVG_GROUP_TYPE_NAME: string = "RNSVGGroup"

export const inheritedComponents: string[] = [SVG_PATH_TYPE_NAME, SVG_RECT_TYPE_NAME, SVG_TEXT_TYPE_NAME]

export type SVGGroupDescriptor = Descriptor<"RNSVGGroup", SVGGroupProps, SVGState, SVGBaseRawProps>

export class SVGGroupDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGGroup", SVGGroupProps> {
}

@Component
export struct SVGGroup {
  ctx!: RNOHContext
  tag: number = 0
  @Consume svgViewCommon: SVGViewRawCommon | undefined
  @BuilderParam buildCustomComponent: (ctx: ComponentBuilderContext) => void
  @State private descriptorWrapper: SVGGroupDescriptorWrapper | undefined = undefined
  @State descriptor: SVGGroupDescriptor = {} as SVGGroupDescriptor
  private unregisterDescriptorChangesListener?: () => void = undefined

  aboutToAppear() {
    this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGGroupDescriptor>(this.tag)
    this.setDescriptorWrapper(this.descriptor)
    this.unregisterDescriptorChangesListener = this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag, (newDescriptor) => {
      this.descriptor = newDescriptor as SVGGroupDescriptor
      this.setDescriptorWrapper(this.descriptor)
      Logger.debug("RNOH SVGGroup New", JSON.stringify(this.descriptor))
    })
    Logger.debug("RNOH SVGGroup", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.()
  }

  setDescriptorWrapper(descriptor: SVGGroupDescriptor) {
    setGroupDescriptor(this.tag, this.descriptor)
    this.descriptorWrapper = new SVGGroupDescriptorWrapper(descriptor)
  }

  mergeProperties(type: string, tag: number) {
    if (type == SVG_GROUP_TYPE_NAME) {
      this.groupPropMerge(tag)
    } else {
      if (inheritedComponents.indexOf(type) !== -1) {
        this.commonPropMerge(type, tag)
      }
    }
  }

  groupPropMerge(tag: number) {
    let descriptor: SVGGroupDescriptor = this.ctx.descriptorRegistry.getDescriptor<SVGGroupDescriptor>(tag)
    let parentPropList: string[] | undefined = this.descriptor.props.propList
    let propList: string[] = descriptor.props.propList ? descriptor.props.propList : []
    descriptor.layoutMetrics.frame.origin = this.descriptor.layoutMetrics.frame.origin
    if (parentPropList && parentPropList.length > 0) {
      descriptor.props.propList = propList.concat(parentPropList);
      parentPropList.forEach((prop: string) => {
        if (prop === 'fill') {
          if (!descriptor.rawProps[prop]) {
            descriptor.rawProps[prop] = this.descriptor.rawProps[prop]
          } else {
            descriptor.rawProps.fill = parseRawFill(descriptor.rawProps.fill, this.descriptor.rawProps.fill, this.svgViewCommon?.svgColor)
          }
        }
        if (!descriptor.props[prop]) {
          descriptor.props[prop] = this.descriptor.props[prop]
        } else {
          switch (prop) {
            // case 'fill':
              // descriptor.props.fill = parseFill(descriptor.props.fill, this.descriptor.props.fill, this.svgViewCommon?.svgColor)
              // break;
            case 'stroke':
              descriptor.props.stroke = parseStroke(descriptor.props.stroke, this.descriptor.props.stroke, convertColorValueToColorSegments(this.svgViewCommon?.svgColor))
              break;
          }
        }
      })
    }
  }

  basicMerge (tag: number, type: string) {
    const childDescriptor = this.ctx.descriptorRegistry.getDescriptor<SVGGroupDescriptor | SVGPathDescriptor | SVGRectDescriptor | SVGImageDescriptor | SVGTextDescriptor | SVGCircleDescriptor>(tag)
    if (!childDescriptor) {
      return
    }
    const parentDescriptor = this.descriptor
    if (parentDescriptor.props.mask) {
      if (!childDescriptor.props.mask) {
        childDescriptor.props.mask = parentDescriptor.props.mask
      }
    }
    let perentMatrics : matrix4.Matrix4Transit
    if (!parentDescriptor.props.combineMetrics) {
      perentMatrics = getTransform(parentDescriptor.props.matrix) as matrix4.Matrix4Transit
    } else {
      perentMatrics = parentDescriptor.props.combineMetrics
    }
    const childMatrics = getTransform(childDescriptor.props.matrix) as matrix4.Matrix4Transit
    const combineMetrics: matrix4.Matrix4Transit = perentMatrics.copy().combine(childMatrics)
    childDescriptor.props.combineMetrics = combineMetrics
  }

  commonPropMerge(type: string, tag: number) {
    let descriptor: SVGPathDescriptor | SVGRectDescriptor | SVGImageDescriptor | SVGTextDescriptor | SVGCircleDescriptor | undefined = undefined
    switch (type) {
      case SVG_PATH_TYPE_NAME:
        descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(tag)
        break;
      case SVG_RECT_TYPE_NAME:
        descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGRectDescriptor>(tag)
        break;
      case SVG_IMAGE_TYPE_NAME:
        descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGImageDescriptor>(tag)
        break;
      case SVG_TEXT_TYPE_NAME:
        descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGTextDescriptor>(tag)
        break;
      case SVG_CIRCLE_TYPE_NAME:
        descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGCircleDescriptor>(tag)
        break;
      default:
        break;
    }
    if (descriptor) {
      descriptor.layoutMetrics.frame.origin = this.descriptor.layoutMetrics.frame.origin
      descriptor.rawProps.fill = parseRawFill(descriptor.rawProps.fill, this.descriptor.rawProps.fill, this.svgViewCommon?.svgColor)
      descriptor.props.stroke = parseStroke(descriptor.props.stroke, this.descriptor.props.stroke, convertColorValueToColorSegments(this.svgViewCommon?.svgColor))
      if (this.descriptor.props.mask) {
        descriptor.props.mask = this.descriptor.props.mask
      }
    }
  }

  getChildrenDescriptors() {
    let childrenTag: Tag[] = []
    let type: string = ''
    this.descriptor.childrenTags.forEach((tag) => {
      const descriptor = this.ctx.descriptorRegistry.getDescriptor<Descriptor<"", SVGBaseProps>>(tag)
      if (descriptor === undefined) {
        Logger.error(`SVGGroup Get Children Descriptor return undefined!`)
      }
      if (descriptor?.props.name) {
        setDefsDescriptor(descriptor.props.name, descriptor)
      }
      type = descriptor?.type;
      if (type === SVG_DEFS_TYPE_NAME) {
        SVGDefsFactory(this.ctx, tag)
      } else if (type === SVG_Mask_TYPE_NAME) {
        SVGMask(this.ctx, tag)
      } else {
        childrenTag.push(tag)
        this.mergeProperties(type, tag)
      }
      this.basicMerge(tag, type)
    })
    return childrenTag
  }

  build() {
    Shape() {
      ForEach(this.getChildrenDescriptors(), (childrenTag: Tag) => {
        svgComponentFactoryBuilder(
          this.ctx,
          childrenTag,
          this.ctx.rnInstance.getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(childrenTag)?.type))
      }, (childrenTag: Tag) => childrenTag.toString())
    }
    .attributeModifier(SVGGroupModifier.getInstance()
      .setDescriptor(
        this.descriptor,
        this.descriptorWrapper,
        this.svgViewCommon,
        this.ctx.descriptorRegistry.getDescriptor<Descriptor>(this.descriptor.parentTag)?.type))
  }
}
