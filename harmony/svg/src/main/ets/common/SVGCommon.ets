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

import { ColorSegments, convertColorSegmentsToString, TransformMatrix } from 'rnoh'
import { getGroupDescriptor, getViewDescriptor, hasViewKey } from './SVGTempCache'
import { SVGOffset } from './SVGType'
import { SVGViewDescriptor } from '../SVGView'
import matrix4 from '@ohos.matrix4'

export function getOffset(x?: string | number, y?: string | number): SVGOffset {
  let offset: SVGOffset = { x: x ? x : 0,
    y: y ? y : 0 }
  return offset
}

export function getScaleX(descriptor: SVGViewDescriptor): number {
  if (!descriptor.props.vbWidth) {
    return 1
  }
  return descriptor
    .layoutMetrics
    .frame
    .size
    .width / descriptor.props.vbWidth
}

export function getScaleY(descriptor: SVGViewDescriptor): number {
  if (!descriptor.props.vbHeight) {
    return 1
  }
  return descriptor
    .layoutMetrics
    .frame
    .size
    .height / descriptor.props.vbHeight
}

export function getTransform(matrix?: number[], scaleValue: number = vp2px(1)): object {
  let transform: TransformMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  if (matrix?.length === 6) {
    const a = matrix[0]
    const b = matrix[1]
    const c = matrix[2]
    const d = matrix[3]
    const e = matrix[4] * scaleValue
    const f = matrix[5] * scaleValue
    transform = [a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, e, f, 0, 1]
  }
  return matrix4.init(transform);
}

export function getColor(color: ColorSegments): string | undefined {
  return convertColorSegmentsToString(color)
}

export function getRadius(rx?: string, ry?: string): string | number | undefined {
  if (rx === '\u0000') {
    return ry !== '\u0000' ? ry : 0
  }
  return rx
}

export function parseCoordinateValue(value?: string): number {
  if (value?.indexOf('%') != -1) {
    value = value?.replace('%', '')
  }
  return value ? Number(value) : 0
}

export function getSvgViewHeight(groupTag?: number): number {
  let height = getViewDescriptor(getSvgViewTag(groupTag))?.layoutMetrics
	.frame
	.size
	.height
  return height ? height : 0
}

export function getSvgViewTag(groupTag?: number): number | undefined {
  let tag = groupTag
  if (tag && !hasViewKey(tag)) {
    while (tag && !hasViewKey(tag)) {
      tag = getGroupDescriptor(tag)?.parentTag
    }
  }
  return tag
}

function parseOffsetValue(value?: string | number): string | number | undefined {
  if (typeof value == 'string' && !value.includes('%')) {
    value = Number(value)
  }
  return value
}
