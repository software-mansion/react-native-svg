import { Descriptor, RNOHContext, Tag } from '@rnoh/react-native-openharmony'
import { SVGCircleDescriptor, SVG_CIRCLE_TYPE_NAME } from '../components/SVGCircle'
import { SVGPathDescriptor, SVG_PATH_TYPE_NAME } from '../components/SVGPath'
import { SVGRectDescriptor, SVG_RECT_TYPE_NAME } from '../components/SVGRect'
import Logger from './log/Logger'
import { getColor, getOffset, getRadius } from './SVGCommon'
import { setMaskDescriptor } from './SVGTempCache'
import { SVGMaskProps } from './SVGType'

export const SVG_Mask_TYPE_NAME: string = "RNSVGMask"
export type SVGMaskType = CircleAttribute | EllipseAttribute | PathAttribute | RectAttribute | ProgressMask
export type SVGMaskDescriptor = Descriptor<"RNSVGMask", SVGMaskProps>
export function SVGMask(ctx: RNOHContext, tag: number): void {
  const descriptor: SVGMaskDescriptor = ctx.descriptorRegistry.getDescriptor<SVGMaskDescriptor>(tag)
  if (descriptor) {
    console.log("RNOH SVGMask childrenTags length: " + descriptor.childrenTags.length)
    let name = descriptor.props.name as string
    if (descriptor.childrenTags.length == 1) {
      descriptor.childrenTags.forEach((childrenTag) => {
        Logger.debug("RNOH SVGMask childrenTag=" + JSON.stringify(childrenTag))
        componentProcessing(name, ctx, childrenTag)
      })
    }
  }
}

function componentProcessing(name: string, ctx: RNOHContext, tag: Tag) {
  let type: string = ctx.descriptorRegistry.getDescriptor(tag).type
  Logger.debug("RNOH SVGMask type=", type)
  Logger.debug("RNOH SVGMask name=", name)
  if (type === SVG_PATH_TYPE_NAME) {
    let descriptorTemp: SVGPathDescriptor = ctx.descriptorRegistry.getDescriptor<SVGPathDescriptor>(tag)
    storageDescriptor(name, getPathAttribute(descriptorTemp))
  } else if (type === SVG_RECT_TYPE_NAME) {
    let descriptorTemp: SVGRectDescriptor = ctx.descriptorRegistry.getDescriptor<SVGRectDescriptor>(tag)
    storageDescriptor(name, getRectAttribute(descriptorTemp))
  } else if (type === SVG_CIRCLE_TYPE_NAME) {
    let descriptorTemp: SVGCircleDescriptor = ctx.descriptorRegistry.getDescriptor<SVGCircleDescriptor>(tag)
    storageDescriptor(name, getCircleAttribute(descriptorTemp))
  }
}

function getPathAttribute(descriptor: SVGPathDescriptor): SVGMaskType {
  let path = new Path({width: '100%', height: '100%'}).fill(getColor(descriptor.props.fill?.payload))
  path.position(descriptor.layoutMetrics.frame.origin)
  path.commands(descriptor.props.d.replace(new RegExp("[-+]?\\d+(\\.\\d+)?","g"),
    match=>vp2px(parseFloat(match)).toString()))
  return path
}

function getRectAttribute(descriptor: SVGRectDescriptor): SVGMaskType {
  let rect = new Rect({width: descriptor.props.width, height: descriptor.props.height})
    .fill(getColor(descriptor.props.fill?.payload))
  rect.position(getOffset(descriptor.props.x, descriptor.props.y))
  if (getRadius(descriptor.props.rx, descriptor.props.ry) !== 1) {
    rect.radiusWidth(getRadius(descriptor.props.rx, descriptor.props.ry))
  }
  if (getRadius(descriptor.props.ry, descriptor.props.rx) !== 1) {
    rect.radiusHeight(getRadius(descriptor.props.ry, descriptor.props.rx))
  }
  return rect
}

function getCircleAttribute(descriptor: SVGCircleDescriptor): SVGMaskType {
  let diameter = Number(descriptor.props.r) * 2
  let circle = new Circle({width: diameter, height: diameter}).fill(getColor(descriptor.props.fill?.payload))
  circle.position(getOffset(getCenterPosition(descriptor.props.cx, descriptor.props.r),
    getCenterPosition(descriptor.props.cy, descriptor.props.r)))
  return circle
}

function getCenterPosition(x: string | undefined, r: string | undefined) {
  return Number(x) - Number(r)
}

function storageDescriptor(key?: string, value?: SVGMaskType) {
  if (key && value) {
    setMaskDescriptor(key, value)
  }
}