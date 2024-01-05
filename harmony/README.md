> 模板版本：v0.1.2

<p align="center">
  <h1 align="center"> <code>react-native-svg</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/software-mansion/react-native-svg">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20windows%20|%20macos%20|%20web%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
    <a href="https://github.com/software-mansion/react-native-svg/blob/main/LICENSE">
        <img src="https://img.shields.io/npm/l/react-native-svg.svg" alt="License" />
    </a>
</p>

> [!tip] [Github 地址](https://github.com/react-native-oh-library/react-native-svg)

## 安装与使用

进入到工程目录并输入以下命令：

<!-- tabs:start -->

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-svg
```

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-svg
```

<!-- tabs:end -->

下面的代码展示了这个库的基本使用场景：

```js
import Svg, { Path } from "react-native-svg";

<Svg width="100" height="100">
  <Path d="M90 0 L0 180 L180 180 Z" fill="red" />
</Svg>;
```

## Link

目前鸿蒙暂不支持 AutoLink，所以 Link 步骤需要手动配置。

首先需要使用 DevEco Studio 打开项目里的鸿蒙工程 `harmony`

### 引入原生端代码

目前有两种方法：

1. 通过 har 包引入（在 IDE 完善相关功能后该方法会被遗弃，目前首选此方法）；
2. 直接链接源码。

方法一：通过 har 包引入
打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "rnoh": "file:../rnoh",
    "rnoh-svg": "file:../../node_modules/@react-native-oh-tpl/react-native-svg/harmony/svg.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码
打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "rnoh": "file:../rnoh",
    "rnoh-svg": "file:../../node_modules/@react-native-oh-tpl/react-native-svg/harmony/svg"
  }
```

打开终端，执行：

```bash
cd entry
ohpm install --no-link
```

### 配置 CMakeLists 和引入 SVGPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(OH_MODULE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: add_package_subdirectories
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
+ add_subdirectory("${OH_MODULE_DIR}/rnoh-svg/src/main/cpp" ./svg)
# RNOH_END: add_package_subdirectories

add_library(rnoh_app SHARED
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)

target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: link_packages
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
+ target_link_libraries(rnoh_app PUBLIC rnoh_svg)
# RNOH_END: link_packages
```

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "SamplePackage.h"
+ #include "SVGPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<SamplePackage>(ctx),
+     std::make_shared<SVGPackage>(ctx)
    };
}
```

### 在 ArkTs 侧引入 SVG 组件

打开 `entry/src/main/ets/pages/index.ets`，添加：

```diff
+ import { SVG_VIEW_TYPE_NAME, SVGView } from "rnoh-svg"

@Builder
function CustomComponentBuilder(ctx: ComponentBuilderContext) {
  if (ctx.componentName === SAMPLE_VIEW_TYPE) {
    SampleView({
      ctx: ctx.rnohContext,
      tag: ctx.tag,
      buildCustomComponent: CustomComponentBuilder
    })
  }
+ else if (ctx.componentName === SVG_VIEW_TYPE_NAME) {
+   SVGView({
+     ctx: ctx.rnohContext,
+     tag: ctx.tag,
+     buildCustomComponent: CustomComponentBuilder
+   })
+ }
 ...
}
...
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-svg Releases](https://github.com/react-native-oh-library/react-native-svg/releases)

## 属性

详细请查看 [react-native-svg 的文档介绍](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md)

以下为目前已支持的组件属性：

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

**Svg**：绘制组件的父组件

|  Name   | Description |      Type       | Required | Platform | HarmonyOS Support |
| :-----: | :---------: | :-------------: | -------- | -------- | ----------------- |
|  width  |  组件宽度   | number\| string | Yes      | All      | Yes               |
| height  |  组件高度   | number\| string | Yes      | All      | Yes               |
| viewBox |  组件视区   |     string      | No       | All      | Yes               |
|  color  |    颜色     |     string      | No       | All      | Yes               |

**G**：该元素是用于对其他 SVG 元素进行分组的容器

| Name | Description | Type | Required | Platform | HarmonyOS Support |
| :--: | :---------: | :--: | -------- | -------- | ----------------- |

**Path**： 路径绘制组件，根据绘制路径生成封闭的自定义形状

| Name |     Description      |  Type  | Required | Platform | HarmonyOS Support |
| :--: | :------------------: | :----: | -------- | -------- | ----------------- |
|  d   | 路径绘制的命令字符串 | string | Yes      | All      | Yes               |

**Rect**： 矩形绘制组件，根据角位置和宽高生成矩形形状

|  Name  |    Description    |      Type       | Required | Platform | HarmonyOS Support |
| :----: | :---------------: | :-------------: | -------- | -------- | ----------------- |
|   x    | 在 x 轴上平移距离 | number\| string | No       | All      | Yes               |
|   y    | 在 y 轴上平移距离 | number\| string | No       | All      | Yes               |
| width  |     元素宽度      | number\| string | Yes      | All      | Yes               |
| height |     元素高度      | number\| string | Yes      | All      | Yes               |
|   rx   | 定义 x 轴上的半径 | number\| string | No       | All      | Yes               |
|   ry   | 定义 y 轴上的半径 | number\| string | No       | All      | Yes               |

**Image**： 图像元素，支持 JPEG、PNG 格式

|  Name  |    Description    |      Type       | Required | Platform | HarmonyOS Support |
| :----: | :---------------: | :-------------: | -------- | -------- | ----------------- |
|   x    | 在 x 轴上平移距离 | number\| string | No       | All      | Yes               |
|   y    | 在 y 轴上平移距离 | number\| string | No       | All      | Yes               |
| width  |     元素宽度      | number\| string | Yes      | All      | Yes               |
| height |     元素高度      | number\| string | Yes      | All      | Yes               |
|  href  |   图像资源引用    | source\| string | Yes      | All      | Yes               |

**公共属性**：Common props 组件属性鸿蒙侧支持情况

|    Name     |             Description              |  Type  | Default | Required | Platform | G   | Path | Rect |
| :---------: | :----------------------------------: | :----: | :-----: | :------: | -------- | --- | ---- | ---- |
|    fill     |           设置填充区域颜色           | string | '#000'  |    No    | All      |     | √    | √    |
|   stroke    | 设置边框颜色，不设置时，默认没有边框 | string | 'none'  |    No    | All      |     | √    | √    |
| strokeWidth |             设置边框宽度             | number |    1    |    No    | All      |     | √    | √    |

## 遗留问题

- [ ] svg 当前仅实现少部分属性（具体见上面已列出的属性），其余还未实现鸿蒙化[issue#5](https://github.com/react-native-oh-library/react-native-svg/issues/5)

## 其他

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/react-native-oh-library/react-native-svg/blob/harmony/LICENSE) ，请自由地享受和参与开源。
