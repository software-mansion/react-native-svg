// swift-tools-version: 6.0
import PackageDescription

// Swift Package Manager support for React Native's SwiftPM autolinking
// (react-native >= 0.88). CocoaPods users are unaffected; see RNSVG.podspec.
// The two React Native packages are resolved by the autolinker relative to
// build/generated/autolinking/libs/RNSVG in the app.

// Precompiled Metal kernels that RNSVGCustomFilter loads by name. Every kernel
// file stays excluded, even the ones copied as resources: SwiftPM reports a
// duplicate rule for a file under a sources directory that is not excluded.
let metalKernelNames = ["RNSVGArithmeticFilter", "RNSVGCompositeXor"]
let metalKernelFiles = ["metal"]
    + ["appletvos", "iphoneos", "macosx", "xros"].flatMap { sdk in ["\(sdk).air", "\(sdk).metallib"] }
let metalKernels = metalKernelNames.flatMap { kernel in
    metalKernelFiles.map { "apple/Filters/MetalCI/\(kernel).\($0)" }
}

let headerSearchPaths = [
    "common/cpp",
    // Resolves <rnsvg/...>, the subspec's header_dir in RNSVG.podspec.
    "common/cpp/react/renderer/components",
    "apple",
    "apple/Brushes",
    "apple/Elements",
    "apple/Filters",
    "apple/Filters/MetalCI",
    "apple/Shapes",
    "apple/Text",
    "apple/Utils",
]

// RCT_NEW_ARCH_ENABLED comes from install_modules_dependencies under
// CocoaPods; without it, all Fabric code compiles out. REACT_NATIVE_MINOR_VERSION
// is the app's exact minor under CocoaPods, but a static manifest cannot read
// the app's React Native version. 88 is the oldest React Native that can
// consume this manifest, so a check against any older minor holds for every
// app that can.
let defines = [
    ("RCT_NEW_ARCH_ENABLED", "1"),
    ("REACT_NATIVE_MINOR_VERSION", "88"),
]

let package = Package(
    name: "RNSVG",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNSVG", targets: ["RNSVG"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNSVG",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: [
                "apple/RNSVG.xcodeproj",
                "apple/RNSVGUIKit.macos.mm",
                "apple/Text/RNSVGTopAlignedLabel.macos.mm",
            ] + metalKernels,
            sources: ["apple", "common/cpp"],
            resources: metalKernelNames.map {
                .copy("apple/Filters/MetalCI/\($0).iphoneos.metallib")
            },
            publicHeadersPath: "apple",
            cSettings: defines.map { .define($0, to: $1) }
                + headerSearchPaths.map { .headerSearchPath($0) },
            cxxSettings: defines.map { .define($0, to: $1) }
                + headerSearchPaths.map { .headerSearchPath($0) }
                + [
                    .define("DEBUG", .when(configuration: .debug)),
                    .define("NDEBUG", .when(configuration: .release)),
                ],
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("CoreGraphics"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
