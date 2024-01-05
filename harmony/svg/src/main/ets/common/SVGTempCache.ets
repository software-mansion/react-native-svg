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

import HashMap from '@ohos.util.HashMap'
import { SVGViewDescriptor } from '../SVGView'
import { SVGGroupDescriptor } from '../components/SVGGroup'

const viewCache: HashMap<number, SVGViewDescriptor> = new HashMap()
const groupCache: HashMap<number, SVGGroupDescriptor> = new HashMap()

const clipPathCache: HashMap<string, object> = new HashMap()

const defsCache: HashMap<string, object> = new HashMap()

export function getViewDescriptor(cacheKey?: number): SVGViewDescriptor | undefined {
  return cacheKey ? viewCache.get(cacheKey) : undefined
}

export function setViewDescriptor(cacheKey: number, descriptor: SVGViewDescriptor): void {
  viewCache.set(cacheKey, descriptor)
}

export function hasViewKey(cacheKey: number): boolean {
  return viewCache.hasKey(cacheKey)
}

export function getGroupDescriptor(cacheKey?: number): SVGGroupDescriptor | undefined {
  return cacheKey ? groupCache.get(cacheKey) : undefined
}

export function setGroupDescriptor(cacheKey: number, descriptor: SVGGroupDescriptor): void {
  groupCache.set(cacheKey, descriptor)
}

export function hasGroupKey(cacheKey: number): boolean {
  return groupCache.hasKey(cacheKey)
}

export function getClipPathDescriptor(cacheKey?: string): object | undefined {
  return cacheKey ? clipPathCache.get(cacheKey) : undefined
}

export function setClipPathDescriptor(cacheKey: string, descriptor: object): void {
  clipPathCache.set(cacheKey, descriptor)
}

export function getDefsDescriptor(cacheKey?: string): object | undefined {
  return cacheKey ? defsCache.get(cacheKey) : undefined
}

export function setDefsDescriptor(cacheKey: string, descriptor?: object): void {
  defsCache.set(cacheKey, descriptor)
}