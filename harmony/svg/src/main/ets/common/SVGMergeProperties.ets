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
import { convertColorValueToColorSegments } from '@rnoh/react-native-openharmony';

import { ColorSegments, SVGColorValue, SVGRawColorValue } from './SVGType'

export function parseFill(fill?: SVGColorValue, parentFill?: SVGColorValue, svgColor?: ColorSegments): SVGColorValue | undefined {
  switch (fill?.type) {
    case 0:
      if (fill.payload && JSON.stringify(fill.payload) == '[0,0,0,1]') {
        fill = parentFill
      }
      break;
    case 2:
      fill.payload = svgColor
      break;
    case 3:
      fill = parentFill
      break;
  }
  return fill
}

export function parseRawFill(fill?: SVGRawColorValue, parentFill?: SVGRawColorValue, svgColor?: number): SVGRawColorValue | undefined {
  switch (fill?.type) {
    case 0:
      if (fill.payload && JSON.stringify(convertColorValueToColorSegments(fill.payload)) == '[0,0,0,1]' && parentFill?.payload) {
        fill = parentFill
      }
      break;
    case 2:
      fill.payload = svgColor
      break;
    case 3:
      fill = parentFill
      break;
  }
  return fill
}

export function parseStroke(stroke?: SVGColorValue, parentStroke?: SVGColorValue, svgColor?: ColorSegments): SVGColorValue | undefined {
  if ((!stroke) && !parentStroke) {
    return stroke
  }
  switch (stroke?.type) {
    case 0:
      stroke.payload = stroke.payload ? stroke.payload : parentStroke?.payload
      break;
    case 2:
      stroke.payload = svgColor
      break;
    case 4:
      stroke = parentStroke
      break;
  }
  return stroke
}