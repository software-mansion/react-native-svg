let supportsCodegenConfig = false;
try {
  const rnCliAndroidVersion =
    require('@react-native-community/cli-platform-android/package.json').version;
  const [major] = rnCliAndroidVersion.split('.');
  supportsCodegenConfig = major >= 9;
} catch (e) {
  // ignore
}

module.exports = {
  dependency: {
    platforms: {
      android: supportsCodegenConfig
        ? {
            componentDescriptors: [
              'RNSVGCircleComponentDescriptor',
              'RNSVGClipPathComponentDescriptor',
              'RNSVGDefsComponentDescriptor',
              'RNSVGFeBlendComponentDescriptor',
              'RNSVGFeColorMatrixComponentDescriptor',
              'RNSVGFeFloodComponentDescriptor',
              'RNSVGFeGaussianBlurComponentDescriptor',
              'RNSVGFeMergeComponentDescriptor',
              'RNSVGFeOffsetComponentDescriptor',
              'RNSVGFilterComponentDescriptor',
              'RNSVGEllipseComponentDescriptor',
              'RNSVGForeignObjectComponentDescriptor',
              'RNSVGGroupComponentDescriptor',
              'RNSVGImageComponentDescriptor',
              'RNSVGLinearGradientComponentDescriptor',
              'RNSVGLineComponentDescriptor',
              'RNSVGMarkerComponentDescriptor',
              'RNSVGMaskComponentDescriptor',
              'RNSVGPathComponentDescriptor',
              'RNSVGPatternComponentDescriptor',
              'RNSVGRadialGradientComponentDescriptor',
              'RNSVGRectComponentDescriptor',
              'RNSVGSvgViewAndroidComponentDescriptor',
              'RNSVGSymbolComponentDescriptor',
              'RNSVGTextComponentDescriptor',
              'RNSVGTextPathComponentDescriptor',
              'RNSVGTSpanComponentDescriptor',
              'RNSVGUseComponentDescriptor',
            ],
            cmakeListsPath: '../android/src/main/jni/CMakeLists.txt',
          }
        : {},
    },
  },
};
