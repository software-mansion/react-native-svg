require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name              = 'RNSVG'
  s.version           = package['version']
  s.summary           = package['description']
  s.license           = package['license']
  s.homepage          = package['homepage']
  s.authors           = 'Horcrux Chen'
  s.platforms         = { :osx => "10.14", :ios => "9.0", :tvos => "9.2" }
  s.source            = { :git => 'https://github.com/react-native-community/react-native-svg.git', :tag => "v#{s.version}" }

  if fabric_enabled
    # folly_version must match the version used in React Native
    # See folly_version in react-native/React/FBReactNativeSpec/FBReactNativeSpec.podspec
    folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

    s.pod_target_xcconfig = {
      'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native"  "$(PODS_ROOT)/RCT-Folly"',
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    }
    s.platforms       = { ios: '11.0', tvos: '11.0' }
    s.compiler_flags  = folly_compiler_flags + ' -DRN_FABRIC_ENABLED'
    s.source_files    = 'apple/**/*.{h,m,mm,cpp}'
    s.ios.exclude_files = '**/*.macos.{h,m,mm,cpp}'
    s.tvos.exclude_files = '**/*.macos.{h,m,mm,cpp}'
    s.osx.exclude_files = '**/*.ios.{h,m,mm,cpp}'
    s.requires_arc    = true
  
    s.dependency "React"
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  else 
    s.source_files       = 'apple/**/*.{h,m,mm}'
    s.exclude_files      = 'apple/Utils/RNSVGFabricConversions.h'
    s.ios.exclude_files  = '**/*.macos.{h,m,mm}'
    s.tvos.exclude_files = '**/*.macos.{h,m,mm}'
    s.osx.exclude_files  = '**/*.ios.{h,m,mm}'
    s.requires_arc       = true
    s.dependency           'React-Core'
  end
end
