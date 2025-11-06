#pragma once
#include "GroupView.g.h"
#include "RenderableView.h"

namespace winrt::RNSVG::implementation {

struct GroupView
    : GroupViewT<GroupView, RNSVG::implementation::RenderableView> {
 public:
  GroupView() = default;

  GroupView(Microsoft::ReactNative::IReactContext const & /*context*/) {}

  Windows::Foundation::Collections::IVector<RNSVG::IRenderable> Children() { return m_children; }

  // IRenderablePaper
  virtual void UpdateProperties(Microsoft::ReactNative::IJSValueReader const &reader, bool forceUpdate, bool invalidate);

  hstring FontFamily() { return m_fontFamily; }
  void FontFamily(hstring const &value) { m_fontFamily = value; }

  float FontSize() { return m_fontSize; }
  void FontSize(float value) { m_fontSize = value; }

  hstring FontWeight() { return m_fontWeight; }
  void FontWeight(hstring const &value) { m_fontWeight = value; }

  // IRenderable
  virtual void CreateResources();
  virtual void MergeProperties(RNSVG::IRenderable const &other);
  virtual void SaveDefinition();
  virtual void CreateGeometry(RNSVG::D2DDeviceContext const &context);
  virtual void Unload();
  virtual RNSVG::IRenderable HitTest(Windows::Foundation::Point const &point);
  void Draw(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

  virtual void DrawGroup(RNSVG::D2DDeviceContext const &deviceContext, Windows::Foundation::Size const &size);

 private:

  Windows::Foundation::Collections::IVector<RNSVG::IRenderable> m_children{
      winrt::single_threaded_vector<RNSVG::IRenderable>()};

  float m_fontSize{12.0f};
  hstring m_fontFamily{L"Segoe UI"};
  hstring m_fontWeight{L"auto"};

  std::map<RNSVG::FontProp, bool> m_fontPropMap{
    {RNSVG::FontProp::FontSize, false},
    {RNSVG::FontProp::FontWeight, false},
    {RNSVG::FontProp::FontFamily, false},
  };
};
} // namespace winrt::RNSVG::implementation

namespace winrt::RNSVG::factory_implementation {
struct GroupView : GroupViewT<GroupView, implementation::GroupView> {};
} // namespace winrt::RNSVG::factory_implementation
