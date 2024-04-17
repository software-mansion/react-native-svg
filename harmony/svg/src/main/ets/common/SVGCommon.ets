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

import { ColorSegments, convertColorSegmentsToString, convertColorValueToHex, TransformMatrix } from '@rnoh/react-native-openharmony'
import { getLinearGradientValue } from './SVGTempCache'
import { SVGColorValue, SVGRawColorValue, SVGGroupBox, SVGOffset } from './SVGType'
import { SVGViewDescriptor } from '../SVGView'
import matrix4 from '@ohos.matrix4'
import { SVGLinearGradientValue } from './SVGLinearGradient'

const defaultScaleValue: number = vp2px(1)

export function getGroupBox(descriptor: SVGViewDescriptor): SVGGroupBox {
  let groupBox: SVGGroupBox = { width: 0, height: 0, minX: 0, minY: 0 }
  let svgWidth = descriptor.layoutMetrics.frame.size.width
  let svgHeight = descriptor.layoutMetrics.frame.size.height
  let contentWidth = descriptor.props.vbWidth ? descriptor.props.vbWidth : svgWidth
  let contentHeight = descriptor.props.vbHeight ? descriptor.props.vbHeight : svgHeight
  if (svgWidth / svgHeight > contentWidth / contentHeight) {
    // 宽高比较大时,高度撑满
    groupBox.width = svgHeight * (contentWidth / contentHeight);
    groupBox.height = svgHeight
  } else {
    // 宽高比较小时,宽度撑满
    groupBox.width = svgWidth
    groupBox.height = svgWidth * (contentHeight / contentWidth);
  }
  if (descriptor.props?.minX) {
    groupBox.minX = descriptor.props?.minX
  }
  if (descriptor.props?.minY) {
    groupBox.minY = descriptor.props?.minY
  }
  return groupBox
}

export function getOffset(x?: string | number, y?: string | number): SVGOffset {
  let offset: SVGOffset = { x: x ? x : 0, y: y ? y : 0 };
  return offset;
}

export function getScaleValue(descriptor: SVGViewDescriptor): number {
  return Math.min(getScaleX(descriptor), getScaleY(descriptor))
}

export function getScaleX(descriptor: SVGViewDescriptor): number {
  if (!descriptor.props.vbWidth) {
    return 1;
  }
  return descriptor.layoutMetrics.frame.size.width / descriptor.props.vbWidth;
}

export function getScaleY(descriptor: SVGViewDescriptor): number {
  if (!descriptor.props.vbHeight) {
    return 1;
  }
  return descriptor.layoutMetrics.frame.size.height / descriptor.props.vbHeight;
}

export function getTransform(matrix?: number[], scaleValue: number = defaultScaleValue): object {
  let transform: TransformMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  if (matrix?.length === 6) {
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const e = matrix[4] * scaleValue;
    const f = matrix[5] * scaleValue;
    transform = [a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, e, f, 0, 1];
  }
  return matrix4.init(transform);
}

export function getStrokeWidth(strokeWidth?: string, scaleValue: number = 1): number {
  return strokeWidth ? Number(strokeWidth) / scaleValue : 1;
}

export function getStrokeLineCap(strokeLineCap?: number): number {
  switch (strokeLineCap) {
    case 1:
      return LineCapStyle.Round
    case 2:
      return LineCapStyle.Square
    default:
      return LineCapStyle.Butt
  }
}

export function getStrokeLineJoin(strokeLineJoin?: number): number {
  switch (strokeLineJoin) {
    case 1:
      return LineJoinStyle.Round
    case 2:
      return LineJoinStyle.Bevel
    default:
      return LineJoinStyle.Miter
  }
}

export function getFillOpacity(fill: SVGColorValue | undefined, fillOpacity: number): number {
  if (fill?.payload) {
    //部分组件fill [0,0,0,0] 无法显示透明，手动处理
    return fill?.payload[3] == 0 ? 0 : fillOpacity
  }
  return 0
}

export function getRawFillOpacity(fill: SVGRawColorValue | undefined, fillOpacity: number): number {
  if (fill?.payload) {
    //部分组件fill [0,0,0,0] 无法显示透明，手动处理
    return fill?.payload[3] == 0 ? 0 : fillOpacity
  }
  return 0
}

export function getColor(color?: ColorSegments): string | undefined {
  return convertColorSegmentsToString(color);
}

export function getRawColor(color?: number): string | undefined {
  return convertColorValueToHex(color);
}

export function getRadius(rx?: string, ry?: string): string | number | undefined {
  if (rx === '\u0000') {
    return ry !== '\u0000' ? ry : 0;
  }
  return rx;
}

export function parseCoordinateValue(value?: string): number {
  if (value?.indexOf('%') != -1) {
    value = value?.replace('%', '');
  }
  return value ? Number(value) : 0;
}

export function getGradient(fill?: SVGColorValue): SVGLinearGradientValue | undefined {
  if (fill?.type == 1) {
    return getLinearGradientValue(fill?.brushRef)
  } else {
    return undefined
  }
}

export function calculateOffset(parentWidth: number, parentHeight: number, childWidth: number, childHeight: number): SVGOffset {
  // 子容器的宽高比
  const childAspectRatio = childWidth / childHeight;

  // 计算子容器在父容器中可放大的最大宽度和高度
  let scaledWidth: number, scaledHeight: number;
  if (parentWidth / parentHeight < childAspectRatio) {
    // 宽度是限制因素，按宽度缩放高度
    scaledWidth = parentWidth;
    scaledHeight = parentWidth / childAspectRatio;
  } else {
    // 高度是限制因素，按高度缩放宽度
    scaledHeight = parentHeight;
    scaledWidth = parentHeight * childAspectRatio;
  }

  // 计算子容器在父容器中居中所需的x、y偏移量
  const offsetX = (parentWidth - scaledWidth) / 2;
  const offsetY = (parentHeight - scaledHeight) / 2;
  // 返回偏移量对象
  return {
    x: offsetX,
    y: offsetY,
  };
}

