#include "pch.h"
#include "BrushView.h"
#include "BrushView.g.cpp"

namespace winrt::RNSVG::implementation {
void BrushView::SaveDefinition() {
  if (auto const &root{SvgRoot()}) {
    root.Brushes().Insert(Id(), *this);
  }
}

void BrushView::SetBounds(Windows::Foundation::Rect const &rect) {
  m_bounds = {rect.X, rect.Y, rect.Width+rect.X, rect.Height+rect.Y};
  UpdateBounds();
}

void BrushView::Unload() {
  if (m_brush) {
    //m_brush.Close();
    m_brush = nullptr;
  }
  
  __super::Unload();
}
} // namespace winrt::RNSVG::implementation
