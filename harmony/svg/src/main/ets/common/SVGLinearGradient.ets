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

import { convertColorValueToRGBA, Descriptor } from 'rnoh'
import Logger from './log/Logger'
import { parseCoordinateValue } from './SVGCommon'
import { SVGLinearGradientProps } from './SVGType'

export const SVG_LINEAR_GRADIENT_TYPE_NAME: string = "RNSVGLinearGradient"

export type SVGLinearGradientDescriptor = Descriptor<"RNSVGLinearGradient", SVGLinearGradientProps>

export class SVGLinearGradientValue {
  angle?: number | string = 0
  direction?: GradientDirection = GradientDirection.Bottom
  colors: Array<[ResourceColor, number]> = []
  repeating?: boolean = false
}

export function parseLinearGradient(descriptor: SVGLinearGradientDescriptor): object {
  console.log("RNOH SVGLinearGradient parseLinearGradient=", JSON.stringify(descriptor))
  let linearGradient: SVGLinearGradientValue = {
    colors: parseGradientColors(descriptor.props.gradient),
    repeating: true
  }
  let x1: number = parseCoordinateValue(descriptor.props.x1)
  let y1: number = parseCoordinateValue(descriptor.props.y1)
  let x2: number = parseCoordinateValue(descriptor.props.x2)
  let y2: number = parseCoordinateValue(descriptor.props.y2)

  if (y1 === y2 && x1 !== x2) {
    linearGradient.direction = x1 < x2 ? GradientDirection.Right : GradientDirection.Left
  } else if (y1 !== y2 && x1 === x2) {
    linearGradient.direction = y1 < y2 ? GradientDirection.Top : GradientDirection.Bottom
  } else if (y1 !== y2 && x1 !== x2) {
    linearGradient.angle = Math.round(Math.atan((y2 - y1) / (x2 - x1)) / (Math.PI / 180))
  }
  Logger.debug("RNOH SVGLinearGradient parseLinearGradient=", JSON.stringify(linearGradient))
  Logger.debug("RNOH SVGLinearGradient parseLinearGradient=", JSON.stringify(linearGradient))
  return linearGradient
}

function parseGradientColors(gradient: number[]): Array<[ResourceColor, number]> {
  let size: number = gradient.length
  if (size == 0) {
    Logger.debug("RNOH SVGLinearGradient Gradient contains no stops")
    return []
  }
  let stopsCount: number = size / 2;
  let colors: Array<[ResourceColor, number]> = new Array(stopsCount)
  for (let i = 0; i < stopsCount; i++) {
    let stopIndex = i * 2
    colors[i] = [convertColorValueToRGBA(gradient[stopIndex+1]), gradient[stopIndex]]
  }
  return colors
}
