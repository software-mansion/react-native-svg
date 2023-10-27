#include "pch.h"
#include "PathView.h"
#if __has_include("PathView.g.cpp")
#include "PathView.g.cpp"
#endif

#include "d2d1svg.h"
#include <cctype>

#include "JSValueXaml.h"
#include "Utils.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::RNSVG::implementation {
void PathView::UpdateProperties(IJSValueReader const &reader, bool forceUpdate, bool invalidate) {
  const JSValueObject &propertyMap{JSValue::ReadObjectFrom(reader)};

  for (auto const &pair : propertyMap) {
    auto const &propertyName{pair.first};
    auto const &propertyValue{pair.second};

    if (propertyName == "d") {
      m_commands.clear();
      m_segmentData.clear();

      if (propertyValue.IsNull()) {
        m_d.clear();
      } else {

        m_d = propertyValue.AsString();
        ParsePath();
      }
    } 
  }

  __super::UpdateProperties(reader, forceUpdate, invalidate);
}

void PathView::CreateGeometry() {
  auto const &root{SvgRoot()};

  com_ptr<ID2D1SvgDocument> doc;
  com_ptr<ID2D1DeviceContext5> deviceContext{get_self<D2DDeviceContext>(root.DeviceContext())->Get().as<ID2D1DeviceContext5>()};

  check_hresult(deviceContext->CreateSvgDocument(
      nullptr,
      D2D1::SizeF(static_cast<float>(root.ActualWidth()), static_cast<float>(root.ActualHeight())),
      doc.put()));

  m_segmentData.resize(m_segmentData.size());
  m_commands.resize(m_commands.size());

  com_ptr<ID2D1SvgPathData> path;
  check_hresult(doc->CreatePathData(
      &m_segmentData[0],
      static_cast<uint32_t>(m_segmentData.size()),
      &m_commands[0],
      static_cast<uint32_t>(m_commands.size()),
      path.put()));

  com_ptr<ID2D1PathGeometry1> geometry;
  check_hresult(path->CreatePathGeometry(D2DHelpers::GetFillRule(FillRule()), geometry.put()));

  Geometry(make<RNSVG::implementation::D2DGeometry>(geometry.as<ID2D1Geometry>()));
}

void PathView::ParsePath() {
  char prev_cmd = ' ';

  size_t i{0};
  auto length{m_d.length()};
  while (i < length) {
    SkipSpaces(i);

    if (i > length) {
      break;
    }

    bool has_prev_cmd{prev_cmd != ' '};
    char first_char = m_d.at(i);

    if (!has_prev_cmd && first_char != 'M' && first_char != 'm') {
      throw hresult_invalid_argument(L"First segment must be a MoveTo.");
    }

    bool is_implicit_move_to{false};
    char cmd = ' ';

    if (IsCommand(first_char)) {
      cmd = first_char;
      m_commands.push_back(m_cmds[cmd]);
      ++i;
    } else if (has_prev_cmd && IsNumberStart(first_char)) {
      if (prev_cmd == 'Z' || prev_cmd == 'z') {
        throw hresult_invalid_argument(L"ClosePath cannot be followed by a number.");
      }

      if (prev_cmd == 'M' || prev_cmd == 'm') {
        // If a MoveTo is followed by multiple pairs of coordinates,
        // the subsequent pairs are treated as implicit LineTo commands.
        is_implicit_move_to = true;
        if (IsUpper(prev_cmd)) {
          cmd = 'L';
          m_commands.push_back(m_cmds[cmd]);
        } else {
          cmd = 'l';
          m_commands.push_back(m_cmds[cmd]);
        }
      } else {
        cmd = prev_cmd;
        m_commands.push_back(m_cmds[cmd]);
      }
    } else {
      throw hresult_invalid_argument(L"Unexpected character: " + first_char);
    }

    bool absolute{IsUpper(cmd)};
    switch (cmd) {
      case 'm':
      case 'M':
      case 'l':
      case 'L':
      case 't':
      case 'T':
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        break;
      case 'h':
      case 'H':
      case 'v':
      case 'V':
        m_segmentData.push_back(ParseListNumber(i));
        break;
      case 's':
      case 'S':
      case 'q':
      case 'Q':
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        break;
      case 'c':
      case 'C':
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        break;
      case 'a':
      case 'A':
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseFlag(i));
        m_segmentData.push_back(ParseFlag(i));
        m_segmentData.push_back(ParseListNumber(i));
        m_segmentData.push_back(ParseListNumber(i));
        break;
      case 'z':
      case 'Z':
        break;
      default:
        throw hresult_invalid_argument(L"Unexpected command.");
    }

    if (is_implicit_move_to) {
      if (absolute) {
        prev_cmd = 'M';
      } else {
        prev_cmd = 'm';
      }
    } else {
      prev_cmd = cmd;
    }
  }
}

void PathView::SkipSpaces(size_t &index) {
  while (index < m_d.length() && IsSpace(m_d.at(index))) {
    ++index;
  }
}

void PathView::SkipDigits(size_t& index) {
  while (index < m_d.length() && IsDigit(m_d.at(index))) {
    ++index;
  }
}

void PathView::SkipListSeparator(size_t& index) {
  if (index < m_d.length() && m_d.at(index) == ',') {
    ++index;
  }
}

bool PathView::IsCommand(char const &cmd) {
  return m_cmds.find(cmd) != m_cmds.end();
}

bool PathView::IsNumberStart(char const& c) {
  return IsDigit(c) || c == '.' || c == '-' || c == '+';
}

bool PathView::IsDigit(char const &c) {
  return std::isdigit(static_cast<unsigned char>(c));
}

bool PathView::IsUpper(char const &c) {
  return std::isupper(static_cast<unsigned char>(c));
}

bool PathView::IsSpace(char const& c) {
  return std::isspace(static_cast<unsigned char>(c));
}

float PathView::ParseListNumber(size_t &index) {
  if (index == m_d.length()) {
    throw hresult_invalid_argument(L"Unexpected end.");
  }

  float result{ParseNumber(index)};
  SkipSpaces(index);
  SkipListSeparator(index);

  return result;
}

float PathView::ParseNumber(size_t &index) {
  SkipSpaces(index);

  if (index == m_d.length()) {
    throw hresult_invalid_argument(L"Unexpected end.");
  }

  size_t start = index;
  char c = m_d.at(start);

  // Consume sign.
  if (c == '-' || c == '+') {
    ++index;
    c = m_d.at(index);
  }

  // Consume integer.
  if (IsDigit(c)) {
    SkipDigits(index);
    if (index < m_d.length()) {
      c = m_d.at(index);
    }
  } else if (c != '.') {
    throw hresult_invalid_argument(L"Invalid number formating character.");
  }

  // Consume fraction.
  if (c == '.') {
    ++index;
    SkipDigits(index);
    if (index < m_d.length()) {
      c = m_d.at(index);
    }
  }

  if ((c == 'e' || c == 'E') && ((index + 1) < m_d.length())) {
    char c2 = m_d.at(index + 1);
    // Check for 'em'/'ex'
    if (c2 != 'm' && c2 != 'x') {
      ++index;
      c = m_d.at(index);

      if (c == '+' || c == '-') {
        ++index;
        SkipDigits(index);
      } else if (IsDigit(c)) {
        SkipDigits(index);
      } else {
        throw hresult_invalid_argument(L"Invalid number formating character.");
      }
    }
  }

  auto num{m_d.substr(start, index)};
  auto result{std::stof(num, nullptr)};

  if (std::isinf(result) || std::isnan(result)) {
    throw hresult_invalid_argument(L"Invalid number.");
  }

  return result;
}

float PathView::ParseFlag(size_t& index) {
  SkipSpaces(index);

  char c = m_d.at(index);
  switch (c) {
    case '0':
    case '1': {
      ++index;
      if (index < m_d.length() && m_d.at(index) == ',') {
        ++index;
      }
      SkipSpaces(index);
      break;
    }
    default:
      throw hresult_invalid_argument(L"Unexpected flag.");
  }

  return static_cast<float>(c - '0');
}

} // namespace winrt::RNSVG::implementation
