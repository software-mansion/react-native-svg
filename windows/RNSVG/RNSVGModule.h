#pragma once

#include "JSValue.h"
#include "NativeModules.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::RNSVG
{
  REACT_MODULE(RNSVGModule, L"RNSVG")
  struct RNSVGModule
  {
    // See https://microsoft.github.io/react-native-windows/docs/native-modules for details on writing native modules

    REACT_INIT(Initialize)
    void Initialize(ReactContext const &reactContext) noexcept
    {
      m_reactContext = reactContext;
    }

    REACT_METHOD(sampleMethod)
    void
    sampleMethod(std::string stringArgument, int numberArgument, std::function<void(std::string)> &&callback) noexcept
    {
      // TODO: Implement some actually useful functionality
      callback("Received numberArgument: " + std::to_string(numberArgument) + " stringArgument: " + stringArgument);
    }

   private:
    ReactContext m_reactContext{nullptr};
  };

} // namespace winrt::RNSVG
