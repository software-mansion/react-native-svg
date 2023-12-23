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

import { Descriptor, RNOHContext, ComponentBuilderContext, Tag, ViewDescriptorWrapperBase } from 'rnoh'
import { SVGGroupProps, SVGViewCommon } from '../common/SVGType'
import { setGroupDescriptor } from '../common/SVGTempCache'
import { SVG_DEFS_TYPE_NAME, SVGDefsFactory } from '../common/SVGDefsFactory'
import { getTransform } from '../common/SVGCommon'
import Logger from '../common/log/Logger'
import { SVGPathDescriptor, SVG_PATH_TYPE_NAME } from './SVGPath'
import { SVGRectDescriptor, SVG_RECT_TYPE_NAME } from './SVGRect'
import { parseFill, parseStroke } from '../common/SVGMergeProperties'
import { SVGTextDescriptor, SVG_TEXT_TYPE_NAME } from './SVGText'
import { SVGImageDescriptor, SVG_IMAGE_TYPE_NAME } from './SVGImage'
import emitter from '@ohos.events.emitter';
import { SVGComponentFactory, svgComponentFactoryBuilder } from '../SVGComponentFactory'
import { SVGCircleDescriptor, SVG_CIRCLE_TYPE_NAME } from './SVGCircle'
import { SVGGroupModifier } from '../attributeModifiers/SVGGroupModifier'

export const SVG_GROUP_TYPE_NAME: string = "RNSVGGroup"

export const inheritedComponents: string[] = [SVG_PATH_TYPE_NAME, SVG_RECT_TYPE_NAME, SVG_TEXT_TYPE_NAME]

export type SVGGroupDescriptor = Descriptor<"RNSVGGroup", SVGGroupProps>

export class SVGGroupDescriptorWrapper extends ViewDescriptorWrapperBase<"RNSVGGroup", SVGGroupProps> {
}

@Component
export struct SVGGroup {
  ctx!: RNOHContext
  tag: number = 0
  @State svgViewCommon: SVGViewCommon | undefined = undefined
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
    }) // this.getEmitterData()
    Logger.debug("RNOH SVGGroup", JSON.stringify(this.descriptor))
  }

  aboutToDisappear() {
    this.unregisterDescriptorChangesListener?.() // emitter.off(this.svgViewCommon.svgTag)
  }

  setDescriptorWrapper(descriptor: SVGGroupDescriptor) {
    setGroupDescriptor(this.tag, this.descriptor)
    this.descriptorWrapper = new SVGGroupDescriptorWrapper(descriptor)
  }

  // getEmitterData(){
  //   if(!this.svgViewCommon.svgTag){
  //     return
  //   }
  //   let innerEvent: emitter.InnerEvent = {
  //     eventId: this.svgViewCommon.svgTag
  //   }
  //   emitter.on(innerEvent, ()=>{
  //     Logger.debug("RNOH SVGGroup emitter 接收", JSON.stringify(innerEvent))
  //     this.descriptor = this.ctx.descriptorRegistry.getDescriptor<SVGGroupDescriptor>(this.tag)
  //     setGroupDescriptor(this.tag,this.descriptor)
  //     this.getChildrenDescriptors()
  //   })
  // }


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
        if (!descriptor.props[prop]) {
          descriptor.props[prop] = this.descriptor.props[prop]
        } else {
          switch (prop) {
            case 'fill':
              descriptor.props.fill = parseFill(descriptor.props.fill, this.descriptor.props.fill, this.svgViewCommon?.svgTag)
              break;
            case 'stroke':
              descriptor.props.stroke = parseStroke(descriptor.props.stroke, this.descriptor.props.stroke, this.svgViewCommon?.svgTag)
              break;
          }
        }
      })
    }
  }

  commonPropMerge(type: string, tag: number) {
    let descriptor: SVGPathDescriptor | SVGRectDescriptor | SVGImageDescriptor | SVGTextDescriptor | undefined = undefined
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
      default:
        break;
    }
    if (descriptor) {
      descriptor.layoutMetrics.frame.origin = this.descriptor.layoutMetrics.frame.origin
      descriptor.props.fill = parseFill(descriptor.props.fill, this.descriptor.props.fill, this.svgViewCommon?.svgTag)
      descriptor.props.stroke = parseStroke(descriptor.props.stroke, this.descriptor.props.stroke, this.svgViewCommon?.svgTag)
    }
  }

  getChildrenDescriptors() {
    let childrenTag: Tag[] = []
    let type: string = ''
    this.descriptor.childrenTags.forEach((tag) => {
      type = this.ctx.descriptorRegistry.getDescriptor<Descriptor>(tag).type
      if (type === SVG_DEFS_TYPE_NAME) {
        SVGDefsFactory(this.ctx, tag)
      } else {
        childrenTag.push(tag)
        this.mergeProperties(type, tag)
      }
    })
    return childrenTag
  }

  build() {
    Shape() {
      ForEach(this.getChildrenDescriptors(), (childrenTag: Tag) => {
        svgComponentFactoryBuilder(this.ctx, childrenTag, this.ctx.rnInstance, getComponentNameFromDescriptorType(this.ctx.descriptorRegistry.getDescriptor(childrenTag)?.type), this.svgViewCommon)

      }, (childrenTag: Tag) => childrenTag.toString())
    }
    .attributeModifier(SVGGroupModifier.getInstance()
      .setDescriptor(this.descriptor, this.descriptorWrapper, this.svgViewCommon, this.ctx.descriptorRegistry.getDescriptor<Descriptor>(this.descriptor.parentTag).type))
  }
}
