#include "RNSVGLayoutableState.h"

namespace facebook::react {


float RNSVGLayoutableState::getX() const {
  return x_;
}

float RNSVGLayoutableState::getY() const {
  return y_;
}

float RNSVGLayoutableState::getWidth() const {
  return width_;
}

float RNSVGLayoutableState::getHeight() const {
  return height_;
}

} // namespace facebook::react
