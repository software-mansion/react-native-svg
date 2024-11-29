#include "pch.h"

#include "SvgView.h"

#include "D2DHelpers.h"
#include "GroupView.h"

#include <AutoDraw.h>
#include <winrt/Microsoft.ReactNative.Composition.Experimental.h>
#include <CompositionSwitcher.Experimental.interop.h>
#include <winrt/Windows.Foundation.Collections.h>

#include <d3d11_4.h>

namespace winrt::RNSVG::implementation {

SvgViewProps::SvgViewProps(const winrt::Microsoft::ReactNative::ViewProps& props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom)
  : m_props(props)
{
  if (cloneFrom) {
    auto cloneFromProps = cloneFrom.as<SvgViewProps>();
    minX = cloneFromProps->minX;
    minY = cloneFromProps->minY;
    vbWidth = cloneFromProps->vbWidth;
    vbHeight = cloneFromProps->vbHeight;
    align = cloneFromProps->align;
    meetOrSlice = cloneFromProps->meetOrSlice;
    color = cloneFromProps->color;
  }
}

void SvgViewProps::SetProp(
    uint32_t hash,
    winrt::hstring propName,
    winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
  winrt::Microsoft::ReactNative::ReadProp(hash, propName, value, *this);
}

SvgView::SvgView(const winrt::Microsoft::ReactNative::Composition::Experimental::ICompositionContext &compContext)
    : m_compContext(compContext) {}

winrt::Microsoft::ReactNative::Composition::Experimental::IVisual SvgView::CreateInternalVisual() {
  m_visual = m_compContext.CreateSpriteVisual();
  m_visual.Comment(L"SVGRoot");
  return m_visual;
}

void SvgView::MountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &,
    const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &) noexcept {
  Invalidate();
}

void SvgView::UnmountChildComponentView(
    const winrt::Microsoft::ReactNative::ComponentView &,
    const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &) noexcept {
  Invalidate();
}

void SvgView::OnThemeChanged() noexcept {
  Invalidate();
}

void SvgView::OnMounted() noexcept {
  m_isMounted = true;
  Invalidate();
}

void SvgView::OnUnmounted() noexcept {
  m_isMounted = false;
}

D2D1_SVG_ASPECT_ALIGN AlignToAspectAlign(const std::string &align) noexcept {
  if (align.compare("xMinYMin") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MIN_Y_MIN;
  else if (align.compare("xMidYMin") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MID_Y_MIN;
  else if (align.compare("xMaxYMin") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MAX_Y_MIN;
  else if (align.compare("xMinYMid") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MIN_Y_MID;
  else if (align.compare("xMidYMid") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MID_Y_MID;
  else if (align.compare("xMaxYMid") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MAX_Y_MID;
  else if (align.compare("xMinYMax") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MIN_Y_MAX;
  else if (align.compare("xMidYMax") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MID_Y_MAX;
  else if (align.compare("xMaxYMax") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_X_MAX_Y_MAX;
  else if (align.compare("none") == 0)
    return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_NONE;

  assert(false);
  return D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_NONE;
}

void SvgView::UpdateProps(
    const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
    const winrt::Microsoft::ReactNative::IComponentProps &newProps,
    const winrt::Microsoft::ReactNative::IComponentProps & /*oldProps*/) noexcept {
  m_props = newProps.as<SvgViewProps>();
  
  if (m_props->align) {
    m_aspectAlign = AlignToAspectAlign(m_props->align.value());
  } else {
    m_aspectAlign = D2D1_SVG_ASPECT_ALIGN::D2D1_SVG_ASPECT_ALIGN_NONE;
  }
}

void SvgView::FinalizeUpates(
    const winrt::Microsoft::ReactNative::ComponentView & /*view*/,
    winrt::Microsoft::ReactNative::ComponentViewUpdateMask) noexcept {
  Invalidate(); // Move to finalize
}

void SvgView::Initialize(const winrt::Microsoft::ReactNative::ComponentView &sender) noexcept {
  auto view = sender.as<winrt::Microsoft::ReactNative::Composition::ViewComponentView>();
  m_wkView = view;

  sender.as<winrt::Microsoft::ReactNative::Composition::Experimental::IInternalCreateVisual>()
      .CreateInternalVisualHandler([wkThis = get_weak()](const winrt::Microsoft::ReactNative::ComponentView &) {
        return wkThis.get()->CreateInternalVisual();
      });

  sender.LayoutMetricsChanged(
      [wkThis = get_weak()](
          const winrt::Windows::Foundation::IInspectable &, const winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs &args) {
        if (auto strongThis = wkThis.get()) {
          strongThis->UpdateLayoutMetrics(args.NewLayoutMetrics(), args.OldLayoutMetrics());
        }
      });

  view.ThemeChanged(
      [wkThis = get_weak()](const winrt::Windows::Foundation::IInspectable & /*sender*/, const winrt::Windows::Foundation::IInspectable & /*args*/) {
        if (auto strongThis = wkThis.get()) {
          strongThis->OnThemeChanged();
        }
      });

  view.Mounted([wkThis = get_weak()](
                   const winrt::Windows::Foundation::IInspectable & /*sender*/, const winrt::Microsoft::ReactNative::ComponentView &) {
    if (auto strongThis = wkThis.get()) {
      strongThis->OnMounted();
    }
  });

  view.Unmounted([wkThis = get_weak()](
                     const winrt::Windows::Foundation::IInspectable & /*sender*/, const winrt::Microsoft::ReactNative::ComponentView &) {
    if (auto strongThis = wkThis.get()) {
      strongThis->OnUnmounted();
    }
  });
}

void SvgView::RegisterComponent(const winrt::Microsoft::ReactNative::IReactPackageBuilderFabric &builder) noexcept {
  builder.AddViewComponent(
      L"RNSVGSvgView", [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props,
                                  const winrt::Microsoft::ReactNative::IComponentProps &cloneFrom) noexcept {
          return winrt::make<SvgViewProps>(props, cloneFrom);
        });
        auto compBuilder =
            builder.as<winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder>();

        compBuilder.SetViewComponentViewInitializer(
            [](const winrt::Microsoft::ReactNative::ComponentView &view) noexcept {
              auto userData = winrt::make_self<SvgView>(
                  view.as<winrt::Microsoft::ReactNative::Composition::Experimental::IInternalComponentView>()
                      .CompositionContext());
              userData->Initialize(view);
              view.UserData(*userData);
            });

        compBuilder.SetViewFeatures(
            winrt::Microsoft::ReactNative::Composition::ComponentViewFeatures::Default &
            ~winrt::Microsoft::ReactNative::Composition::ComponentViewFeatures::Background);

        builder.SetUpdatePropsHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                         const winrt::Microsoft::ReactNative::IComponentProps &newProps,
                                         const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
          auto userData = winrt::get_self<SvgView>(view.UserData());
          userData->UpdateProps(view, newProps, oldProps);
        });

        builder.SetFinalizeUpdateHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::ComponentViewUpdateMask mask) noexcept {
              auto userData = winrt::get_self<SvgView>(view.UserData());
              userData->FinalizeUpates(view, mask);
            });

        builder.SetMountChildComponentViewHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::MountChildComponentViewArgs &args) noexcept {
              auto userData = winrt::get_self<SvgView>(view.UserData());
              return userData->MountChildComponentView(view, args);
            });

        builder.SetUnmountChildComponentViewHandler(
            [](const winrt::Microsoft::ReactNative::ComponentView &view,
               const winrt::Microsoft::ReactNative::UnmountChildComponentViewArgs &args) noexcept {
              auto userData = winrt::get_self<SvgView>(view.UserData());
              return userData->UnmountChildComponentView(view, args);
            });
      });
}

void SvgView::UpdateLayoutMetrics(
    const winrt::Microsoft::ReactNative::LayoutMetrics &metrics,
    const winrt::Microsoft::ReactNative::LayoutMetrics &oldMetrics) {
  m_layoutMetrics = metrics;

  if (metrics != oldMetrics) {
    Invalidate();
  }
}

void RecurseRenderNode(
    const SvgView *root,
    const winrt::Microsoft::ReactNative::ComponentView &view,
    ID2D1SvgDocument &document,
    ID2D1SvgElement &svgElement) noexcept {
  for (auto const &child : view.Children()) {
    {
      auto renderable = child.UserData().try_as<RenderableView>();

      if (renderable && renderable->IsSupported()) {
        ID2D1SvgElement &newElement = renderable->Render(*root, document, svgElement);
        RecurseRenderNode(root, child, document, newElement);
      }
    }
  }
}

void SvgView::Draw(
    const winrt::Microsoft::ReactNative::Composition::ViewComponentView &view,
    ID2D1DeviceContext &context,
    winrt::Windows::Foundation::Size const &size) noexcept {

  com_ptr<ID2D1DeviceContext> deviceContext;
  deviceContext.copy_from(&context);

  auto deviceContext5 = deviceContext.as<ID2D1DeviceContext5>();

  winrt::com_ptr<ID2D1SvgDocument> spSvgDocument;
  deviceContext5->CreateSvgDocument(nullptr, D2D1_SIZE_F{size.Width, size.Height}, spSvgDocument.put());

  winrt::com_ptr<ID2D1SvgElement> spRoot;
  spSvgDocument->GetRoot(spRoot.put());

  if (m_props->vbWidth != std::nullopt || m_props->vbHeight != std::nullopt) {
    std::wstring viewBoxStr = std::to_wstring(m_props->minX.value_or(0)) + L" " +
        std::to_wstring(m_props->minY.value_or(0)) + L" " + std::to_wstring(m_props->vbWidth.value_or(0)) + L" " +
        std::to_wstring(m_props->vbHeight.value_or(0));
    spRoot->SetAttributeValue(
        SvgStrings::viewBoxAttributeName,
        D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
        viewBoxStr.c_str());
  }

  spRoot->SetAttributeValue(
      SvgStrings::widthAttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, std::to_wstring(size.Width).c_str());
  spRoot->SetAttributeValue(
      SvgStrings::heightAttributeName, D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG, std::to_wstring(size.Height).c_str());

  if (m_props->color) {
    spRoot->SetAttributeValue(
        SvgStrings::colorAttributeName, D2DHelpers::AsD2DColor(m_props->color.AsWindowsColor(Theme())));
  } else
    spRoot->SetAttributeValue(
        SvgStrings::colorAttributeName,
      D2D1_SVG_ATTRIBUTE_STRING_TYPE::D2D1_SVG_ATTRIBUTE_STRING_TYPE_SVG,
      SvgStrings::noneAttributeValue);

  if (m_props->align != std::nullopt || m_props->meetOrSlice != std::nullopt) {
    D2D1_SVG_PRESERVE_ASPECT_RATIO preserveAspectRatio;
    preserveAspectRatio.defer = false;
    preserveAspectRatio.align = m_aspectAlign;

    preserveAspectRatio.meetOrSlice = m_props->meetOrSlice.value() == MeetOrSlice::Meet
        ? D2D1_SVG_ASPECT_SCALING::D2D1_SVG_ASPECT_SCALING_MEET
        : D2D1_SVG_ASPECT_SCALING::D2D1_SVG_ASPECT_SCALING_SLICE;
    spRoot->SetAttributeValue(SvgStrings::preserveAspectRatioAttributeName, preserveAspectRatio);
  }

  for (auto const &child : view.Children()) {
    auto renderable = child.UserData().as<RenderableView>();
    if (renderable->IsSupported()) {
      RecurseRenderNode(this, child, *spSvgDocument, *spRoot);
    }
  }

  deviceContext5->DrawSvgDocument(spSvgDocument.get());
}

winrt::Microsoft::ReactNative::Composition::Theme SvgView::Theme() const noexcept {
  if (auto view = m_wkView.get()) {
    return view.Theme();
  }
  return nullptr;
}

void SvgView::Invalidate() {
  if (auto view = m_wkView.get()) {
    auto size = winrt::Windows::Foundation::Size{m_layoutMetrics.Frame.Width, m_layoutMetrics.Frame.Height};

    if (!m_isMounted) {
      return;
    }

    if (size.Height == 0 || size.Width == 0) {
      return;
    }

    auto drawingSurface = m_compContext.CreateDrawingSurfaceBrush(
        size,
        winrt::Windows::Graphics::DirectX::DirectXPixelFormat::B8G8R8A8UIntNormalized,
        winrt::Windows::Graphics::DirectX::DirectXAlphaMode::Premultiplied);

    POINT offset;
    {
      ::Microsoft::ReactNative::Composition::AutoDrawDrawingSurface autoDraw(drawingSurface, 1.0, &offset);
      if (auto deviceContext = autoDraw.GetRenderTarget()) {
        auto transform =
            winrt::Windows::Foundation::Numerics::make_float3x2_translation({static_cast<float>(offset.x), static_cast<float>(offset.y)});
        deviceContext->SetTransform(D2DHelpers::AsD2DTransform(transform));

        deviceContext->Clear(D2D1::ColorF(D2D1::ColorF::Black, 0.0f));

        com_ptr<ID2D1DeviceContext> spDeviceContext;
        spDeviceContext.copy_from(deviceContext);

        Draw(view, *spDeviceContext, size);
      }
    }

    m_visual.Brush(drawingSurface);
  }
}
} // namespace winrt::RNSVG::implementation
