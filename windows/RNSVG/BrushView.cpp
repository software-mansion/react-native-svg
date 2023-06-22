#include "pch.h"
#include "BrushView.h"
#include "BrushView.g.cpp"

namespace winrt::RNSVG::implementation {
void BrushView::SaveDefinition() {
  if (auto const &root{SvgRoot()}) {
    CreateBrush();
    root.Brushes().Insert(Id(), *this);
  }
}

void BrushView::SetBounds(Windows::Foundation::Rect const &rect) {
  m_bounds = rect;
  UpdateBounds();
}

void BrushView::Unload() {
  if (m_brush) {
    m_brush.Close();
    m_brush = nullptr;
  }
  
  __super::Unload();
}
} // namespace winrt::RNSVG::implementation
