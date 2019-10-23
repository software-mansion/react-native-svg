## [9.13.2](https://github.com/react-native-community/react-native-svg/compare/v9.13.1...v9.13.2) (2019-10-23)


### Bug Fixes

* make css-select and css-tree dependencies instead of peers ([957914d](https://github.com/react-native-community/react-native-svg/commit/957914d59b27e22121d13f13cb54a051b893b446)), closes [#1166](https://github.com/react-native-community/react-native-svg/issues/1166)

## [9.13.1](https://github.com/react-native-community/react-native-svg/compare/v9.13.0...v9.13.1) (2019-10-23)


### Bug Fixes

* update flow types ([a50a856](https://github.com/react-native-community/react-native-svg/commit/a50a85671ea94e616eff761346875701f95d90ec))

# [9.13.0](https://github.com/react-native-community/react-native-svg/compare/v9.12.0...v9.13.0) (2019-10-23)


### Bug Fixes

* camelCase css from style elements ([9ee5a28](https://github.com/react-native-community/react-native-svg/commit/9ee5a28b37edf403c503aed4f37edbaebe201eb0))
* don't overwrite inline styles when inlining style elements ([6e1d825](https://github.com/react-native-community/react-native-svg/commit/6e1d8257a4b42b9888a6374ae203f07a932ca96f))
* handle basic css media query selectors ([168ee25](https://github.com/react-native-community/react-native-svg/commit/168ee25ee4b193d85757e01b20840baf54872cfc))
* handle style elements with CDATA ([b3fca84](https://github.com/react-native-community/react-native-svg/commit/b3fca84fb1b9091246310270d64dcef730ee05a9))
* improve style element inlining, support more selectors and optimize ([8c9de72](https://github.com/react-native-community/react-native-svg/commit/8c9de72bda2a4e00efb1747f7c8e922fac92e194))
* improve types for extractTransform ([a37ebbb](https://github.com/react-native-community/react-native-svg/commit/a37ebbbb1559b337b58327f79819c494029597fa))
* only compute selector specificity once per selector ([9f53e31](https://github.com/react-native-community/react-native-svg/commit/9f53e31b24c940052a8d25671f92074194856f05))
* types for css support ([c969159](https://github.com/react-native-community/react-native-svg/commit/c96915923e784607b14b7f437ae4dd58c31bde36))
* use correct import in test ([a57963e](https://github.com/react-native-community/react-native-svg/commit/a57963eb4d3ec0c1645bf4251cf2b54507441532))


### Features

* implement experiment to inline css from style elements ([5f3852b](https://github.com/react-native-community/react-native-svg/commit/5f3852bf9cb41e79d50a4fcb800fdd7ba895f023))
* implement SvgWithCss and SvgWithCssUri with Animated support ([6fb8dd5](https://github.com/react-native-community/react-native-svg/commit/6fb8dd53dba5af19ffc8f686a6310182fca87fd3))

# [9.12.0](https://github.com/react-native-community/react-native-svg/compare/v9.11.1...v9.12.0) (2019-10-19)


### Bug Fixes

* handle setting transform attribute on clipPath, fixes [#1152](https://github.com/react-native-community/react-native-svg/issues/1152) ([73b21d1](https://github.com/react-native-community/react-native-svg/commit/73b21d1))
* improve handling of transform attribute on clipPath, fixes [#1152](https://github.com/react-native-community/react-native-svg/issues/1152) ([3aa126e](https://github.com/react-native-community/react-native-svg/commit/3aa126e))
* **ios:** backwards compatible RCTImageLoader.h handling fixes [#1141](https://github.com/react-native-community/react-native-svg/issues/1141) ([3c22c97](https://github.com/react-native-community/react-native-svg/commit/3c22c97))
* **ios:** clipPath rendering, fixes [#1131](https://github.com/react-native-community/react-native-svg/issues/1131) ([2534537](https://github.com/react-native-community/react-native-svg/commit/2534537))
* **ios:** deprecation of RCTImageLoader fixes [#1141](https://github.com/react-native-community/react-native-svg/issues/1141) ([5452144](https://github.com/react-native-community/react-native-svg/commit/5452144))
* **ios:** fix changes in color/currentColor/tintColor, fixes [#1151](https://github.com/react-native-community/react-native-svg/issues/1151) ([0c7e94d](https://github.com/react-native-community/react-native-svg/commit/0c7e94d))
* **ios:** image viewBox opposite handling of y alignment, fixes [#1138](https://github.com/react-native-community/react-native-svg/issues/1138) ([c69e9e2](https://github.com/react-native-community/react-native-svg/commit/c69e9e2))
* **js:** allow setting stopColor/Opacity/Offset using styles, fix [#1153](https://github.com/react-native-community/react-native-svg/issues/1153) ([5984e06](https://github.com/react-native-community/react-native-svg/commit/5984e06))
* getPointAtLength signature ([2c57af2](https://github.com/react-native-community/react-native-svg/commit/2c57af2))
* getScreenCTM calculation ([5c5072d](https://github.com/react-native-community/react-native-svg/commit/5c5072d))
* improve native method spec conformance ([c63f9e2](https://github.com/react-native-community/react-native-svg/commit/c63f9e2))
* improve types for getBBox ([cecde7d](https://github.com/react-native-community/react-native-svg/commit/cecde7d))
* prepare script ([9a3dc4e](https://github.com/react-native-community/react-native-svg/commit/9a3dc4e))
* **ios:** memory leak in tspan, fixes [#1073](https://github.com/react-native-community/react-native-svg/issues/1073) ([974f3a8](https://github.com/react-native-community/react-native-svg/commit/974f3a8))
* fix native methods spec conformance ([ecedb21](https://github.com/react-native-community/react-native-svg/commit/ecedb21))
* Make native methods synchronous ([8ce7611](https://github.com/react-native-community/react-native-svg/commit/8ce7611))
* refine types for matrix helpers ([409af91](https://github.com/react-native-community/react-native-svg/commit/409af91))
* refine types for matrix helpers ([7a3f867](https://github.com/react-native-community/react-native-svg/commit/7a3f867))
* **android:** defineMarker/getDefinedMarker storage ([e6eda84](https://github.com/react-native-community/react-native-svg/commit/e6eda84))
* **android:** native method scaling and getScreenCTM offset ([f3e0b19](https://github.com/react-native-community/react-native-svg/commit/f3e0b19))
* native method signatures web compatibility / spec conformance ([8687a3d](https://github.com/react-native-community/react-native-svg/commit/8687a3d))
* **ios:** optimize extractPathData, clear PathMeasure when no textPath ([df69c26](https://github.com/react-native-community/react-native-svg/commit/df69c26))


### Features

* **flow:** add flowgen to generate flow types from typescript, [#1125](https://github.com/react-native-community/react-native-svg/issues/1125) ([fcd66fb](https://github.com/react-native-community/react-native-svg/commit/fcd66fb))
* implement getBBox, getCTM, getScreenCTM ([f13d54a](https://github.com/react-native-community/react-native-svg/commit/f13d54a))
* implement isPointInStroke ([2ba64df](https://github.com/react-native-community/react-native-svg/commit/2ba64df))
* initial implementation of isPointInFill ([203e53b](https://github.com/react-native-community/react-native-svg/commit/203e53b))
* support using native methods using promises instead of callbacks ([c28499b](https://github.com/react-native-community/react-native-svg/commit/c28499b))
* **android:** implement getTotalLength and getPointAtLength ([cd667d0](https://github.com/react-native-community/react-native-svg/commit/cd667d0))
* **ios:** implement getTotalLength and getPointAtLength ([78c4f20](https://github.com/react-native-community/react-native-svg/commit/78c4f20))

## [9.11.1](https://github.com/react-native-community/react-native-svg/compare/v9.11.0...v9.11.1) (2019-10-03)


### Bug Fixes

* marker onPress & gestures ([bff92f0](https://github.com/react-native-community/react-native-svg/commit/bff92f0))

# [9.11.0](https://github.com/react-native-community/react-native-svg/compare/v9.10.2...v9.11.0) (2019-10-03)


### Features

* implement support for context-fill and context-stroke color ([f9a7238](https://github.com/react-native-community/react-native-svg/commit/f9a7238))

## [9.10.2](https://github.com/react-native-community/react-native-svg/compare/v9.10.1...v9.10.2) (2019-10-02)


### Bug Fixes

* marker viewBox translation ([b111028](https://github.com/react-native-community/react-native-svg/commit/b111028))

## [9.10.1](https://github.com/react-native-community/react-native-svg/compare/v9.10.0...v9.10.1) (2019-10-01)


### Bug Fixes

* project.pbxproj for non cocoapods builds ([cd70134](https://github.com/react-native-community/react-native-svg/commit/cd70134)), closes [#1130](https://github.com/react-native-community/react-native-svg/issues/1130)

# [9.10.0](https://github.com/react-native-community/react-native-svg/compare/v9.9.9...v9.10.0) (2019-10-01)


### Features

* improve marker rendering ([9628830](https://github.com/react-native-community/react-native-svg/commit/9628830))
* improve marker rendering ([2e3069d](https://github.com/react-native-community/react-native-svg/commit/2e3069d))
* **android:** implement marker rendering ([ceee5ff](https://github.com/react-native-community/react-native-svg/commit/ceee5ff))
* **ios:** implement marker rendering ([589363d](https://github.com/react-native-community/react-native-svg/commit/589363d))
* define marker attributes ([61533c6](https://github.com/react-native-community/react-native-svg/commit/61533c6))
* define marker element ([e7b5978](https://github.com/react-native-community/react-native-svg/commit/e7b5978))

## [9.9.9](https://github.com/react-native-community/react-native-svg/compare/v9.9.8...v9.9.9) (2019-09-28)


### Bug Fixes

* handling of numeric id ([2fb39f5](https://github.com/react-native-community/react-native-svg/commit/2fb39f5)), closes [#1077](https://github.com/react-native-community/react-native-svg/issues/1077)

## [9.9.8](https://github.com/react-native-community/react-native-svg/compare/v9.9.7...v9.9.8) (2019-09-28)


### Bug Fixes

* **android:** mask height and vertical position calculation ([74b42a7](https://github.com/react-native-community/react-native-svg/commit/74b42a7)), closes [#1097](https://github.com/react-native-community/react-native-svg/issues/1097)

## [9.9.7](https://github.com/react-native-community/react-native-svg/compare/v9.9.6...v9.9.7) (2019-09-28)


### Bug Fixes

* add gradientTransform to d.ts ([3f08c46](https://github.com/react-native-community/react-native-svg/commit/3f08c46)), closes [#1069](https://github.com/react-native-community/react-native-svg/issues/1069)
* handling of gradients without stops ([18828c0](https://github.com/react-native-community/react-native-svg/commit/18828c0)), closes [#1099](https://github.com/react-native-community/react-native-svg/issues/1099)
* handling of rounded rect ([c12d66e](https://github.com/react-native-community/react-native-svg/commit/c12d66e)), closes [#1112](https://github.com/react-native-community/react-native-svg/issues/1112)
* units in linear and radial gradients ([70c54e6](https://github.com/react-native-community/react-native-svg/commit/70c54e6)), closes [#1110](https://github.com/react-native-community/react-native-svg/issues/1110) [#1118](https://github.com/react-native-community/react-native-svg/issues/1118)

## [9.9.6](https://github.com/react-native-community/react-native-svg/compare/v9.9.5...v9.9.6) (2019-09-27)


### Bug Fixes

* **ios:** animation of clipPath contents, fixes [#1119](https://github.com/react-native-community/react-native-svg/issues/1119) ([8bb5b22](https://github.com/react-native-community/react-native-svg/commit/8bb5b22))
* handling of focusable, fixes [#1117](https://github.com/react-native-community/react-native-svg/issues/1117) ([bd7e492](https://github.com/react-native-community/react-native-svg/commit/bd7e492))

## [9.9.5](https://github.com/react-native-community/react-native-svg/compare/v9.9.4...v9.9.5) (2019-09-25)


### Bug Fixes

* handling of color/tintColor, fixes [#1088](https://github.com/react-native-community/react-native-svg/issues/1088) and [#1115](https://github.com/react-native-community/react-native-svg/issues/1115) ([1eaf3a6](https://github.com/react-native-community/react-native-svg/commit/1eaf3a6))

## [9.9.4](https://github.com/react-native-community/react-native-svg/compare/v9.9.3...v9.9.4) (2019-09-16)


### Bug Fixes

* release process ([79bbaf1](https://github.com/react-native-community/react-native-svg/commit/79bbaf1))
