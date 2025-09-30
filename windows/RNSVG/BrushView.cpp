#include "pch.h"
#include "BrushView.h"
#if __has_include("BrushView.g.cpp")
#include "BrushView.g.cpp"
#endif

#include "D2DHelpers.h"

namespace winrt::RNSVG::implementation {

void BrushView::SaveDefinition() {
  if (auto const &root{SvgRoot()}) {
    CreateBrush();
    root.Brushes().Insert(Id(), *this);
  }
}

void BrushView::SetBounds(Rect const &rect) {
  m_bounds = D2DHelpers::AsD2DRect(rect);
  UpdateBounds();
}

void BrushView::Unload() {
  if (m_brush) {
    m_brush = nullptr;
  }

  __super::Unload();
}
} // namespace winrt::RNSVG::implementation
