#include "pch.h"
#include "UseView.h"
#include "UseView.g.cpp"

#include "Utils.h"

using namespace winrt;
using namespace Microsoft::Graphics::Canvas;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void UseView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

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

void UseView::Render(UI::Xaml::CanvasControl const &canvas, CanvasDrawingSession const &session) {
  if (auto const &view{GetRenderableTemplate()}) {
    auto const &originalTransform{session.Transform()};
    auto transform{Numerics::make_float3x2_scale(1)};

    // Figure out any necessary transforms
    if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
      if (symbol.Align() != L"") {
        if (auto const &root{SvgRoot()}) {
          Rect vbRect{
              symbol.MinX() * root.SvgScale(),
              symbol.MinY() * root.SvgScale(),
              (symbol.MinX() + symbol.VbWidth()) * root.SvgScale(),
              (symbol.MinY() + symbol.VbHeight()) * root.SvgScale()};

          float elX{Utils::GetAbsoluteLength(m_x, canvas.Size().Width)};
          float elY{Utils::GetAbsoluteLength(m_y, canvas.Size().Height)};
          float elWidth{Utils::GetAbsoluteLength(m_width, canvas.Size().Width)};
          float elHeight{Utils::GetAbsoluteLength(m_height, canvas.Size().Height)};
          Rect elRect{elX, elY, elWidth, elHeight};

          transform = Utils::GetViewBoxTransform(vbRect, elRect, to_string(symbol.Align()), symbol.MeetOrSlice());
        }
      }
    } else {
      float x{Utils::GetAbsoluteLength(m_x, canvas.Size().Width)};
      float y{Utils::GetAbsoluteLength(m_y, canvas.Size().Height)};
      transform = Numerics::make_float3x2_translation({x, y});
    }

    // Combine new transform with existing one if it's set
    if (m_propSetMap[RNSVG::BaseProp::Matrix]) {
      transform = transform * SvgTransform();
    }

    session.Transform(transform);

    // Propagate props to template
    view.MergeProperties(*this);

    // Set opacity and render
    if (auto const &opacityLayer{session.CreateLayer(m_opacity)}) {
      if (auto const &symbol{view.try_as<RNSVG::SymbolView>()}) {
        symbol.RenderGroup(canvas, session);
      } else {
        view.Render(canvas, session);
      }
      opacityLayer.Close();
    }

    // Restore original template props
    if (auto const &parent{view.SvgParent().try_as<RNSVG::RenderableView>()}) {
      view.MergeProperties(parent);
    }

    // Restore session transform
    session.Transform(originalTransform);

  } else {
    throw hresult_not_implemented(L"'Use' element expected a pre-defined svg template as 'href' prop. Template named: " + m_href + L" is not defined");
  }
}

RNSVG::IRenderable UseView::GetRenderableTemplate() {
  if (auto const &root{SvgRoot()}) {
    return root.Templates().TryLookup(m_href);
  }

  return nullptr;
}
} // namespace winrt::RNSVG::implementation
