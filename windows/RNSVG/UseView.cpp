#include "pch.h"
#include "UseView.h"
#if __has_include("UseView.g.cpp")
#include "UseView.g.cpp"
#endif

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {

#ifdef USE_FABRIC
UseProps::UseProps(const winrt::Microsoft::ReactNative::ViewProps &props) : base_type(props) {}

void UseProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

UseView::UseView(const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) : base_type(args) {}

void UseView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGUse", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props) noexcept {
          return winrt::make<winrt::RNSVG::implementation::UseProps>(props);
        });
        builder.SetCreateComponentView([](const winrt::Microsoft::ReactNative::CreateComponentViewArgs &args) noexcept {
          return winrt::make<winrt::RNSVG::implementation::UseView>(args);
        });
      });
}

void UseView::UpdateProperties(
    const winrt::Microsoft::ReactNative::IComponentProps &props,
    const winrt::Microsoft::ReactNative::IComponentProps &oldProps,
    bool forceUpdate,
    bool invalidate) noexcept {
  auto useProps = props.try_as<UseProps>();
  if (useProps) {
    m_props = useProps;

    m_href = winrt::to_hstring(m_props->href);
    m_x = m_props->x;
    m_y = m_props->y;
    m_width = m_props->width;
    m_height = m_props->height;
  }

  base_type::UpdateProperties(props, oldProps, forceUpdate, invalidate);
}
#else
void UseView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "href") {
      m_href = to_hstring(Utils::JSValueAsString(propertyValue));
    } else if (propertyName == "x") {
      m_x = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "y") {
      m_y = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "width") {
      m_width = propertyValue.To<RNSVG::SVGLength>();
    } else if (propertyName == "height") {
      m_height = propertyValue.To<RNSVG::SVGLength>();
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}
#endif

void UseView::Draw(RNSVG::D2DDeviceContext const &context, Size const &size) {
  if (auto const &view{GetRenderableTemplate()}) {
    com_ptr<ID2D1DeviceContext> deviceContext{get_self<D2DDeviceContext>(context)->Get()};

    D2D1_MATRIX_3X2_F originalTransform{D2DHelpers::GetTransform(deviceContext.get())};
    auto transform{originalTransform};

    float x{Utils::GetAbsoluteLength(m_x, size.Width)};
    float y{Utils::GetAbsoluteLength(m_y, size.Height)};

    transform = D2D1::Matrix3x2F::Translation({x, y}) * originalTransform;

    // Combine new transform with existing one if it's set
    if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
      transform = transform * D2DHelpers::AsD2DTransform(SvgTransform());
    }

    // Figure out any necessary transforms
    if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
      if (symbol.Align() != L"") {
        Rect vbRect{
            symbol.MinX(),
            symbol.MinY(),
            (symbol.MinX() + symbol.VbWidth()),
            (symbol.MinY() + symbol.VbHeight())};

        float elWidth{Utils::GetAbsoluteLength(m_width, size.Width)};
        float elHeight{Utils::GetAbsoluteLength(m_height, size.Height)};
        Rect elRect{0.0f, 0.0f, elWidth, elHeight};

        auto vbTransform{Utils::GetViewBoxTransformD2D(vbRect, elRect, to_string(symbol.Align()), symbol.MeetOrSlice())};
        transform = vbTransform * transform;
      }
    }

    deviceContext->SetTransform(transform);

    // Propagate props to template
    view.MergeProperties(*this);

    // Set opacity and render
    D2DHelpers::PushOpacityLayer(deviceContext.get(), nullptr, m_opacity);
    if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
      symbol.DrawGroup(context, size);
    } else {
      view.Draw(context, size);
    }

    deviceContext->PopLayer();

    // Restore original template props
#ifdef USE_FABRIC
    auto renderable{view.try_as<RNSVG::IRenderableFabric>()};
#else
    auto renderable{view.try_as<RNSVG::IRenderablePaper>()};
#endif
    if (renderable) {
      if (auto const &parent{renderable.SvgParent().try_as<RNSVG::RenderableView>()}) {
        view.MergeProperties(parent);
      }
    }

    // Restore session transform
    deviceContext->SetTransform(originalTransform);

  }
}

RNSVG::IRenderable UseView::GetRenderableTemplate() {
  if (auto const &root{SvgRoot()}) {
    return root.Templates().TryLookup(m_href);
  }

  return nullptr;
}
} // namespace winrt::RNSVG::implementation
