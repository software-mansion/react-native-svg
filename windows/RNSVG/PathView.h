#pragma once

#include "PathView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {
struct PathView : PathViewT<PathView, RNSVG::implementation::RenderableView> {
 public:
  PathView() = default;

  void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);
  void CreateGeometry(Microsoft::Graphics::Canvas::UI::Xaml::CanvasControl const &canvas);

 private:
  std::string m_d;
  std::vector<float> m_segmentData;
  std::vector<Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand> m_commands;

  std::map<char, Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand> m_cmds{
      {'M', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::MoveAbsolute},
      {'m', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::MoveRelative},
      {'Z', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::ClosePath},
      {'z', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::ClosePath},
      {'L', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::LineAbsolute},
      {'l', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::LineRelative},
      {'H', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::HorizontalAbsolute},
      {'h', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::HorizontalRelative},
      {'V', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::VerticalAbsolute},
      {'v', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::VerticalRelative},
      {'C', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::CubicAbsolute},
      {'c', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::CubicRelative},
      {'S', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::CubicSmoothAbsolute},
      {'s', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::CubicSmoothRelative},
      {'Q', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::QuadraticAbsolute},
      {'q', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::QuadraticRelative},
      {'T', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::QuadraticSmoothAbsolute},
      {'t', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::QuadraticSmoothRelative},
      {'A', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::ArcAbsolute},
      {'a', Microsoft::Graphics::Canvas::Svg::CanvasSvgPathCommand::ArcRelative},
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
