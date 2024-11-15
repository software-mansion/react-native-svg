#pragma once

#include <unknwn.h>

#include <d2d1_3.h>
#include <NativeModules.h>
#pragma push_macro("X86")
#undef X86
#include <winrt/Microsoft.ReactNative.Composition.Experimental.h>
#include <winrt/Microsoft.ReactNative.h>
#include <JSValueComposition.h>
#pragma pop_macro("X86")

namespace winrt::RNSVG::implementation {

D2D1_SVG_ASPECT_ALIGN AlignToAspectAlign(const std::string &align) noexcept;

enum class MeetOrSlice {
    Meet = 0,
    Slice = 1,
};

REACT_STRUCT(SvgViewProps)
struct SvgViewProps : winrt::implements<SvgViewProps, winrt::Microsoft::ReactNative::IComponentProps> {
  SvgViewProps(const winrt::Microsoft::ReactNative::ViewProps &props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom);

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept;

  REACT_FIELD(minX)
  std::optional<float> minX;
  REACT_FIELD(minY)
  std::optional<float> minY;
  REACT_FIELD(vbWidth)
  std::optional<float> vbWidth;
  REACT_FIELD(vbHeight)
  std::optional<float> vbHeight;
  REACT_FIELD(align)
  std::optional<std::string> align;
  REACT_FIELD(meetOrSlice)
  std::optional<MeetOrSlice> meetOrSlice;
  REACT_FIELD(color)
  winrt::Microsoft::ReactNative::Color color{nullptr};
 private:
  winrt::Microsoft::ReactNative::ViewProps m_props{nullptr};
};

struct __declspec(uuid("ed381ffa-461a-48Bf-a3c0-5d9a42eecd30")) ISvgView : public ::IUnknown {
  virtual void Invalidate() = 0;
};

struct SvgView : winrt::implements<SvgView, winrt::Windows::Foundation::IInspectable, ISvgView> {
 public:

  SvgView(const winrt::Microsoft::ReactNative::Composition::Experimental::ICompositionContext &compContext);

  // Overrides
  // IInternalCreateVisual
  winrt::Microsoft::ReactNative::Composition::Experimental::IVisual CreateInternalVisual();

  // ComponentView
  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      const winrt::Microsoft::ReactNative::IComponentProps &newProps,
      const winrt::Microsoft::ReactNative::IComponentProps & /*oldProps*/) noexcept;
  void UpdateLayoutMetrics(
      const winrt::Microsoft::ReactNative::LayoutMetrics &metrics,
      const winrt::Microsoft::ReactNative::LayoutMetrics &oldMetrics);
  void MountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView& view,
      const winrt::Microsoft::ReactNative::MountChildComponentViewArgs& args) noexcept;
  void UnmountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView& view,
      const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs& args) noexcept;

  void FinalizeUpates(
      const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
      winrt::Microsoft::ReactNative::ComponentViewUpdateMask mask) noexcept;

  void OnThemeChanged() noexcept;
  void OnMounted() noexcept;
  void OnUnmounted() noexcept;

  void Initialize(const winrt::Microsoft::ReactNative::ComponentView & /*view*/) noexcept;

  static void RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept;

  void Invalidate();
  winrt::Microsoft::ReactNative::Composition::Theme Theme() const noexcept;

 private:
  void Draw(
      const winrt::Microsoft::ReactNative::Composition::ViewComponentView &view,
      ID2D1DeviceContext &context,
      winrt::Windows::Foundation::Size const &size) noexcept;

  bool m_isMounted{false};
  winrt::Microsoft::ReactNative::Composition::Experimental::ISpriteVisual m_visual{nullptr};
  winrt::Microsoft::ReactNative::LayoutMetrics m_layoutMetrics{{0, 0, 0, 0}, 1.0};
  winrt::Microsoft::ReactNative::Composition::Experimental::ICompositionContext m_compContext{nullptr};
  winrt::weak_ref<winrt::Microsoft::ReactNative::Composition::ViewComponentView> m_wkView;
  D2D1_SVG_ASPECT_ALIGN m_aspectAlign;
  winrt::com_ptr<SvgViewProps> m_props;

  // Shared
  Microsoft::ReactNative::IReactContext m_reactContext{nullptr};
};
} // namespace winrt::RNSVG::implementation
