#include "pch.h"
#include "UseView.h"
#include "UseView.g.cpp"

#include "Utils.h"

namespace winrt::RNSVG::implementation {
void UseView::UpdateProperties(
    Microsoft::ReactNative::IJSValueReader const &reader,
    bool forceUpdate,
    bool invalidate) {
  const Microsoft::ReactNative::JSValueObject &propertyMap{
      Microsoft::ReactNative::JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "href") {
      m_href = to_hstring(Utils::JSValueAsString(propertyValue));
    } else if (propertyName == "x") {
      m_x = SVGLength::From(propertyValue);
    } else if (propertyName == "y") {
      m_y = SVGLength::From(propertyValue);
    } else if (propertyName == "width") {
      m_width = SVGLength::From(propertyValue);
    } else if (propertyName == "height") {
      m_height = SVGLength::From(propertyValue);
    }
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void UseView::Draw() {
  if (auto const &root{SvgRoot()}) {
    if (auto const &view{GetRenderableTemplate()}) {
      com_ptr<ID2D1DeviceContext1> deviceContext;
      copy_to_abi(root.DeviceContext(), *deviceContext.put_void());

      D2D1_MATRIX_3X2_F originalTransform;
      deviceContext->GetTransform(&originalTransform);

      auto originalScale = Utils::GetScale(originalTransform);
      auto svgTransformScale = Utils::GetScale(SvgTransform());

      auto transform{Numerics::make_float3x2_scale(1)};

      // Figure out any necessary transforms
      if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
        if (symbol.Align() != L"") {
          Rect vbRect{
              symbol.MinX() * SvgScale(),
              symbol.MinY() * SvgScale(),
              (symbol.MinX() + symbol.VbWidth()) * SvgScale(),
              (symbol.MinY() + symbol.VbHeight()) * SvgScale()};

          float elX{Utils::GetAbsoluteLength(m_x, root.ActualWidth())};
          float elY{Utils::GetAbsoluteLength(m_y, root.ActualHeight())};
          float elWidth{Utils::GetAbsoluteLength(m_width, root.ActualWidth())};
          float elHeight{Utils::GetAbsoluteLength(m_height, root.ActualHeight())};
          Rect elRect{elX, elY, elWidth, elHeight};

          transform = Utils::GetViewBoxTransform(vbRect, elRect, to_string(symbol.Align()), symbol.MeetOrSlice());
        }
      } else {
        float x{Utils::GetAbsoluteLength(m_x, root.ActualWidth())};
        float y{Utils::GetAbsoluteLength(m_y, root.ActualHeight())};
        transform = Numerics::make_float3x2_translation({x, y});
      }

      // Combine new transform with existing one if it's set
      if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
        transform = transform * SvgTransform();
      }

      if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
        deviceContext->SetTransform(D2DHelpers::AsD2DTransform(transform * SvgTransform()));
      }

      // Propagate props to template
      view.MergeProperties(*this);

      // Set opacity and render
      D2DHelpers::PushOpacityLayer(deviceContext.get(), nullptr, m_opacity);
      if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
        symbol.DrawGroup();
      } else {
        view.Draw();
      }

      deviceContext->PopLayer();

      // Restore original template props
      if (auto const &parent{view.SvgParent().try_as<RNSVG::RenderableView>()}) {
        view.MergeProperties(parent);
      }

      // Restore session transform
      deviceContext->SetTransform(originalTransform);

    } else {
      throw hresult_not_implemented(
          L"'Use' element expected a pre-defined svg template as 'href' prop. Template named: " + m_href +
          L" is not defined");
    }
  }
}

RNSVG::IRenderable UseView::GetRenderableTemplate() {
  if (auto const &root{SvgRoot()}) {
    return root.Templates().TryLookup(m_href);
  }

  return nullptr;
}
} // namespace winrt::RNSVG::implementation
