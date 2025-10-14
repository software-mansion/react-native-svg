#pragma once

#ifdef ANDROID
#include <folly/dynamic.h>
#endif

namespace facebook::react {

class RNSVGLayoutableState {
public:
  RNSVGLayoutableState()
    : x_(0), y_(0), width_(0), height_(0) {}

  RNSVGLayoutableState(float x, float y, float width, float height)
    : x_(x), y_(y), width_(width), height_(height) {}

#ifdef ANDROID
  RNSVGLayoutableState(RNSVGLayoutableState const &previousState, folly::dynamic data)
    : x_((float)data["x"].getDouble()),
    y_((float)data["y"].getDouble()),
    width_((float)data["width"].getDouble()),
    height_((float)data["height"].getDouble()){};
  folly::dynamic getDynamic() const {
    return {};
  };
#endif

  float getX() const;
  float getY() const;
  float getWidth() const;
  float getHeight() const;

private:
  const float x_{};
  const float y_{};
  const float width_{};
  const float height_{};
};

} // namespace facebook::react
