import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, Easing, Platform } from 'react-native';

import ModalPortal from './Portal';
import { Portal } from 'react-native-paper';
import * as ariaAppHider from './ariaAppHider';
import { SafeHTMLElement } from './utils';
import styles from './styles';

let ariaHiddenInstances = 0;

export default class Modal extends Component {
  static setAppElement(element) {
    ariaAppHider.setElement(element);
  }

  static propTypes = {
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    transparent: PropTypes.bool,
    visible: PropTypes.bool,
    onRequestClose:
      Platform.isTV || Platform.OS === 'android'
        ? PropTypes.func.isRequired
        : PropTypes.func,
    onShow: PropTypes.func,
    onDismiss: PropTypes.func,
    children: PropTypes.node.isRequired,
    ariaHideApp: PropTypes.bool,
    appElement: PropTypes.instanceOf(SafeHTMLElement),
  };

  static defaultProps = {
    animationType: 'none',
    transparent: false,
    visible: true,
    onShow: () => {},
    onRequestClose: () => {},
    onDismiss: () => {},
    ariaHideApp: true,
    appElement: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      animationSlide: null,
      animationFade: null,
      styleFade: { display: props.visible ? 'flex' : 'none' },
      opacityFade: new Animated.Value(0),
      slideTranslation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.props.visible) this.handleShow();
  }

  componentWillReceiveProps({ visible }) {
    if (visible && !this.props.visible) this.handleShow();
    if (!visible && this.props.visible) this.handleClose();
  }

  handleShow() {
    const { animationType, onShow, ariaHideApp, appElement } = this.props;

    if (ariaHideApp) {
      ariaHiddenInstances += 1;
      ariaAppHider.hide(appElement);
    }

    if (animationType === 'slide') {
      this.animateSlideIn(onShow);
    } else if (animationType === 'fade') {
      this.animateFadeIn(onShow);
    } else {
      onShow();
    }
  }

  handleClose() {
    const { animationType, onDismiss, ariaHideApp, appElement } = this.props;

    if (animationType === 'slide') {
      this.animateSlideOut(onDismiss);
    } else if (animationType === 'fade') {
      this.animateFadeOut(onDismiss);
    } else {
      onDismiss();
    }

    if (ariaHideApp && ariaHiddenInstances > 0) {
      ariaHiddenInstances -= 1;

      if (ariaHiddenInstances === 0) {
        ariaAppHider.show(appElement);
      }
    }
  }

  // Fade Animation Implementation
  animateFadeIn = callback => {
    if (this.state.animationFade) {
      this.state.animationFade.stop();
    }

    const animationFade = Animated.timing(this.state.opacityFade, {
      toValue: 1,
      duration: 300,
    });

    this.setState(
      {
        animationFade,
      },
      () => {
        requestAnimationFrame(() => {
          this.setState({ styleFade: { display: 'flex' } }, () =>
            this.state.animationFade.start(callback)
          );
        });
      }
    );
  };

  animateFadeOut = callback => {
    if (this.state.animationFade) {
      this.state.animationFade.stop();
    }

    const animationFade = Animated.timing(this.state.opacityFade, {
      toValue: 0,
      duration: 300,
    });

    this.setState(
      {
        animationFade,
      },
      () => {
        requestAnimationFrame(() => {
          this.state.animationFade.start(() => {
            this.setState(
              {
                styleFade: { display: 'none' },
              },
              callback
            );
          });
        });
      }
    );
  };
  // End of Fade Animation Implementation

  // Slide Animation Implementation
  animateSlideIn = callback => {
    if (this.state.animationSlide) {
      this.state.animationSlide.stop();
    }

    const animationSlide = Animated.timing(this.state.slideTranslation, {
      toValue: 1,
      easing: Easing.out(Easing.poly(4)),
      duration: 300,
    });

    this.setState(
      {
        animationSlide,
      },
      () => {
        requestAnimationFrame(() => {
          this.setState({ styleFade: { display: 'flex' } }, () =>
            this.state.animationSlide.start(callback)
          );
        });
      }
    );
  };

  animateSlideOut = callback => {
    if (this.state.animationSlide) {
      this.state.animationSlide.stop();
    }

    const animationSlide = Animated.timing(this.state.slideTranslation, {
      toValue: 0,
      easing: Easing.in(Easing.poly(4)),
      duration: 300,
    });

    this.setState(
      {
        animationSlide,
      },
      () => {
        requestAnimationFrame(() => {
          this.state.animationSlide.start(() => {
            this.setState(
              {
                styleFade: { display: 'none' },
              },
              callback
            );
          });
        });
      }
    );
  };
  // End of Slide Animation Implementation

  getAnimationStyle() {
    const { visible, animationType } = this.props;
    const { styleFade } = this.state;

    if (animationType === 'slide') {
      return [
        {
          transform: [
            {
              translateY: this.state.slideTranslation.interpolate({
                inputRange: [0, 1],
                outputRange: [Dimensions.get('window').height, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
        styleFade,
      ];
    }
    if (animationType === 'fade') {
      return [{ opacity: this.state.opacityFade }, styleFade];
    }

    return [styles[visible ? 'visible' : 'hidden']];
  }

  render() {
    const { transparent, children } = this.props;

    const transparentStyle = transparent
      ? styles.bgTransparent
      : styles.bgNotTransparent;
    const animationStyle = this.getAnimationStyle();

    return (
      <Portal.Host>
        <Animated.View
          aria-modal="true"
          style={[styles.baseStyle, transparentStyle, animationStyle]}>
          {children}
        </Animated.View>
      </Portal.Host>
    );
  }
}
