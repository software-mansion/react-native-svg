#pragma once

#include "SVGLength.g.h"

#include "JSValueXaml.h"

namespace winrt::RNSVG::implementation
{
    struct SVGLength : SVGLengthT<SVGLength>
    {
     public:
        SVGLength() = default;
        SVGLength(float value);
        SVGLength(float value, RNSVG::UnitType type);

        float Value() { return m_value; }
        RNSVG::UnitType Unit() { return m_unit; }

        static RNSVG::SVGLength From(std::string value);
        static RNSVG::SVGLength From(Microsoft::ReactNative::JSValue const& value);

     private:
        float m_value{0.0f};
        RNSVG::UnitType m_unit{RNSVG::UnitType::Unknown};
    };
}

namespace winrt::RNSVG::factory_implementation
{
    struct SVGLength : SVGLengthT<SVGLength, implementation::SVGLength>
    {
    };
}
