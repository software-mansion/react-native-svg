#pragma once

#ifdef USE_FABRIC
#include "PathProps.g.h"
#endif

#include "PathView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
REACT_STRUCT(PathProps)
struct PathProps : PathPropsT<PathProps, SvgRenderableCommonProps> {
  PathProps(const winrt::Microsoft::ReactNative::ViewProps &props);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept
      override;

  REACT_SVG_NODE_COMMON_PROPS;
  REACT_SVG_RENDERABLE_COMMON_PROPS;

  REACT_FIELD(d)
  std::string d;
};
#endif

struct PathView : PathViewT<PathView, RNSVG::implementation::RenderableView> {
 public:
  PathView() = default;

#ifdef USE_FABRIC
  PathView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args);

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  // IRenderableFabric
  void UpdateProperties(
      const winrt::Microsoft::ReactNative::IComponentProps &props,
      const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
      bool forceUpdate = true,
      bool invalidate = true) noexcept override;
#else
  // IRenderablePaper
  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
#endif

  // IRenderable
  void CreateGeometry(RNSVG::D2DDeviceContext const &context);

 private:
  std::string m_d;
  std::vector<float> m_segmentData;
  std::vector<D2D1_SVG_PATH_COMMAND> m_commands;

#ifdef USE_FABRIC
  com_ptr<PathProps> m_props;
#endif

  std::unordered_map<char, D2D1_SVG_PATH_COMMAND> m_cmds{
      {'M', D2D1_SVG_PATH_COMMAND_MOVE_ABSOLUTE},
      {'m', D2D1_SVG_PATH_COMMAND_MOVE_RELATIVE},
      {'Z', D2D1_SVG_PATH_COMMAND_CLOSE_PATH},
      {'z', D2D1_SVG_PATH_COMMAND_CLOSE_PATH},
      {'L', D2D1_SVG_PATH_COMMAND_LINE_ABSOLUTE},
      {'l', D2D1_SVG_PATH_COMMAND_LINE_RELATIVE},
      {'H', D2D1_SVG_PATH_COMMAND_HORIZONTAL_ABSOLUTE},
      {'h', D2D1_SVG_PATH_COMMAND_HORIZONTAL_RELATIVE},
      {'V', D2D1_SVG_PATH_COMMAND_VERTICAL_ABSOLUTE},
      {'v', D2D1_SVG_PATH_COMMAND_VERTICAL_RELATIVE},
      {'C', D2D1_SVG_PATH_COMMAND_CUBIC_ABSOLUTE},
      {'c', D2D1_SVG_PATH_COMMAND_CUBIC_RELATIVE},
      {'S', D2D1_SVG_PATH_COMMAND_CUBIC_SMOOTH_ABSOLUTE},
      {'s', D2D1_SVG_PATH_COMMAND_CUBIC_SMOOTH_RELATIVE},
      {'Q', D2D1_SVG_PATH_COMMAND_QUADRADIC_ABSOLUTE},
      {'q', D2D1_SVG_PATH_COMMAND_QUADRADIC_RELATIVE},
      {'T', D2D1_SVG_PATH_COMMAND_QUADRADIC_SMOOTH_ABSOLUTE},
      {'t', D2D1_SVG_PATH_COMMAND_QUADRADIC_SMOOTH_RELATIVE},
      {'A', D2D1_SVG_PATH_COMMAND_ARC_ABSOLUTE},
      {'a', D2D1_SVG_PATH_COMMAND_ARC_RELATIVE},
  };

  void ParsePath();

  // Parser helpers
  void SkipSpaces(size_t &index);
  void SkipDigits(size_t &index);
  void SkipListSeparator(size_t &index);
  bool IsCommand(char const &cmd);
  bool IsNumberStart(char const &c);
  bool IsDigit(char const &c);
  bool IsUpper(char const &c);
  bool IsSpace(char const &c);
  float ParseListNumber(size_t &index);
  float ParseNumber(size_t &index);
  float ParseFlag(size_t &index);
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct PathView : PathViewT<PathView, implementation::PathView> {};
} // namespace winrt::RNSVG::factory_implementation
