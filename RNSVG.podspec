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
  s.source            = { :git => 'https://github.com/react-native-community/react-native-svg.git', :tag => "v#{s.version}" }
  s.source_files    = 'apple/**/*.{h,m,mm}'
  s.ios.exclude_files = '**/*.macos.{h,m,mm}'
  s.tvos.exclude_files = '**/*.macos.{h,m,mm}'
  s.visionos.exclude_files = '**/*.macos.{h,m,mm}' if s.respond_to?(:visionos)
  s.osx.exclude_files = '**/*.ios.{h,m,mm}'
  s.requires_arc    = true
  s.platforms         = { :osx => "10.14", :ios => "12.4", :tvos => "12.4", :visionos => "1.0" }

  if fabric_enabled
    install_modules_dependencies(s)

    s.subspec "common" do |ss|
      ss.source_files         = "common/cpp/**/*.{cpp,h}"
      ss.header_dir           = "rnsvg"
      ss.pod_target_xcconfig  = { "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\"" }
    end
  else
    s.exclude_files      = 'apple/Utils/RNSVGFabricConversions.h'
    s.dependency           'React-Core'
  end
end
