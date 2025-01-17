#include "pch.h"
#include "UnsupportedSvgView.h"

namespace winrt::RNSVG::implementation {

REACT_STRUCT(UnsupportedProps)
struct UnsupportedProps : public winrt::implements<UnsupportedProps, winrt::Microsoft::ReactNative::IComponentProps> {
  UnsupportedProps(const winrt::Microsoft::ReactNative::ViewProps &/*props*/, const winrt::Microsoft::ReactNative::IComponentProps& /*cloneFrom*/) {}

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
  }
};

struct UnsupportedSvgView : winrt::implements<UnsupportedSvgView, winrt::Windows::Foundation::IInspectable, RenderableView> {
 public:
  UnsupportedSvgView() = default;

  const wchar_t *GetSvgElementName() noexcept override{
  assert(false);
  return L"unsupported";
}

  bool IsSupported() const noexcept override {
    return false;
  }
};

void RegisterUnsupportedSvgComponent(const winrt::hstring& name, const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  RegisterRenderableComponent<UnsupportedProps, UnsupportedSvgView>(name, builder);
}

} // namespace winrt::RNSVG::implementation
