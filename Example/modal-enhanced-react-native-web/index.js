/**
 * MIT License
 * Copyright (c) 2017 Ryan Florence
 * https://github.com/reactjs/react-modal/blob/master/LICENSE
 *
 * Take WAI-ARIA for React Native Web
 *
 * Modified by Ray Andrew <raydreww@gmail.com>
 * For Modal React Native Web
 *
 * MIT License
 * Copyright (c) 2018 Ray Andrew
 * https://github.com/rayandrews/react-native-web-modal
 */

import React, { Component } from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  View,
  initializeRegistryWithDefinitions,
  registerAnimation,
  createAnimation,
} from 'react-native-animatable';
import Modal from '../modal-react-native-web';

import * as ANIMATION_DEFINITIONS from './animations';

import styles from './styles';

// Override default animations
initializeRegistryWithDefinitions(ANIMATION_DEFINITIONS);

// Utility for creating custom animations
const makeAnimation = (name, obj) => {
  registerAnimation(name, createAnimation(obj));
};

const isObject = obj => obj !== null && typeof obj === 'object';

class ReactNativeModal extends Component {
  static setAppElement = Modal.setAppElement;

  static propTypes = {
    animationIn: PropTypes.oneOfType([PropTypes.string, PropTypes.shape]),
    animationInTiming: PropTypes.number,
    animationOut: PropTypes.oneOfType([PropTypes.string, PropTypes.shape]),
    animationOutTiming: PropTypes.number,
    avoidKeyboard: PropTypes.bool,
    backdropColor: PropTypes.string,
    backdropOpacity: PropTypes.number,
    backdropTransitionInTiming: PropTypes.number,
    backdropTransitionOutTiming: PropTypes.number,
    children: PropTypes.node.isRequired,
    isVisible: PropTypes.bool,
    hideModalContentWhileAnimating: PropTypes.bool,
    onModalShow: PropTypes.func,
    onModalHide: PropTypes.func,
    onBackButtonPress: PropTypes.func,
    onBackdropPress: PropTypes.func,
    onSwipe: PropTypes.func,
    swipeThreshold: PropTypes.number,
    swipeDirection: PropTypes.oneOf(['up', 'down', 'left', 'right']),
    useNativeDriver: PropTypes.bool,
    style: PropTypes.any,
    scrollTo: PropTypes.func,
    scrollOffset: PropTypes.number,
    scrollOffsetMax: PropTypes.number,
  };

  static defaultProps = {
    animationIn: 'slideInUp',
    animationInTiming: 300,
    animationOut: 'slideOutDown',
    animationOutTiming: 300,
    avoidKeyboard: false,
    backdropColor: 'black',
    backdropOpacity: 0.7,
    backdropTransitionInTiming: 300,
    backdropTransitionOutTiming: 300,
    onModalShow: () => null,
    onModalHide: () => null,
    isVisible: false,
    hideModalContentWhileAnimating: false,
    onBackdropPress: () => null,
    onBackButtonPress: () => null,
    swipeThreshold: 100,
    useNativeDriver: false,
    scrollTo: null,
    scrollOffset: 0,
    scrollOffsetMax: 0,
  };

  // We use an internal state for keeping track of the modal visibility: this allows us to keep
  // the modal visibile during the exit animation, even if the user has already change the
  // isVisible prop to false.
  // We store in the state the device width and height so that we can update the modal on
  // device rotation.
  state = {
    showContent: true,
    isVisible: false,
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
    isSwipeable: !!this.props.swipeDirection,
    pan: null,
  };

  transitionLock = null;

  inSwipeClosingState = false;

  constructor(props) {
    super(props);
    this.buildAnimations(props);
    if (this.state.isSwipeable) {
      this.state = { ...this.state, pan: new Animated.ValueXY() };
      this.buildPanResponder();
    }
    if (this.props.isVisible) {
      this.state = {
        ...this.state,
        isVisible: true,
        showContent: true,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isVisible && nextProps.isVisible) {
      this.setState({ isVisible: true, showContent: true });
    }
    if (
      this.props.animationIn !== nextProps.animationIn ||
      this.props.animationOut !== nextProps.animationOut
    ) {
      this.buildAnimations(nextProps);
    }
    if (
      this.props.backdropOpacity !== nextProps.backdropOpacity &&
      this.backdropRef
    ) {
      this.backdropRef.transitionTo(
        { opacity: nextProps.backdropOpacity },
        this.props.backdropTransitionInTiming
      );
    }
  }

  componentDidMount() {
    if (this.state.isVisible) {
      this.open();
    }
    // window.addEventListener('resize', () => {
    //   this.handleDimensionsUpdate();
    // });
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', () => {
    //   this.handleDimensionsUpdate();
    // });
  }

  componentDidUpdate(prevProps) {
    // On modal open request, we slide the view up and fade in the backdrop
    if (this.props.isVisible && !prevProps.isVisible) {
      this.open();
    } else if (!this.props.isVisible && prevProps.isVisible) {
      // On modal close request, we slide the view down and fade out the backdrop
      this._close();
    }
  }

  buildPanResponder = () => {
    let animEvt = null;

    if (
      this.props.swipeDirection === 'right' ||
      this.props.swipeDirection === 'left'
    ) {
      animEvt = Animated.event([null, { dx: this.state.pan.x }]);
    } else {
      animEvt = Animated.event([null, { dy: this.state.pan.y }]);
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (this.props.scrollTo) {
          if (this.props.scrollOffset > 0) {
            return false; // user needs to be able to scroll content back up
          }
        }
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Dim the background while swiping the modal
        const accDistance = this.getAccDistancePerDirection(gestureState);
        const newOpacityFactor = 1 - accDistance / this.state.deviceWidth;
        if (this.isSwipeDirectionAllowed(gestureState)) {
          this.backdropRef &&
            this.backdropRef.transitionTo({
              opacity: this.props.backdropOpacity * newOpacityFactor,
            });
          animEvt(evt, gestureState);
        } else if (this.props.scrollTo) {
          let offsetY = -gestureState.dy;
          if (offsetY > this.props.scrollOffsetMax) {
            offsetY -= (offsetY - this.props.scrollOffsetMax) / 2;
          }
          this.props.scrollTo({ y: offsetY, animated: false });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Call the onSwipe prop if the threshold has been exceeded
        const accDistance = this.getAccDistancePerDirection(gestureState);
        if (accDistance > this.props.swipeThreshold) {
          if (this.props.onSwipe) {
            this.inSwipeClosingState = true;
            this.props.onSwipe();
            return;
          }
        }
        // Reset backdrop opacity and modal position
        if (this.backdropRef) {
          this.backdropRef.transitionTo(
            { opacity: this.props.backdropOpacity },
            this.props.backdropTransitionInTiming
          );
        }
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          bounciness: 0,
        }).start();
        if (this.props.scrollOffset > this.props.scrollOffsetMax) {
          this.props.scrollTo({
            y: this.props.scrollOffsetMax,
            animated: true,
          });
        }
      },
    });
  };

  getAccDistancePerDirection = gestureState => {
    switch (this.props.swipeDirection) {
      case 'up':
        return -gestureState.dy;
      case 'down':
        return gestureState.dy;
      case 'right':
        return gestureState.dx;
      case 'left':
        return -gestureState.dx;
      default:
        return 0;
    }
  };

  isSwipeDirectionAllowed = ({ dy, dx }) => {
    const draggedDown = dy > 0;
    const draggedUp = dy < 0;
    const draggedLeft = dx < 0;
    const draggedRight = dx > 0;

    if (this.props.swipeDirection === 'up' && draggedUp) {
      return true;
    }
    if (this.props.swipeDirection === 'down' && draggedDown) {
      return true;
    }
    if (this.props.swipeDirection === 'right' && draggedRight) {
      return true;
    }
    if (this.props.swipeDirection === 'left' && draggedLeft) {
      return true;
    }
    return false;
  };

  // User can define custom react-native-animatable animations, see PR #72
  buildAnimations = props => {
    let animationIn = props.animationIn;
    let animationOut = props.animationOut;

    if (isObject(animationIn)) {
      const animationName = JSON.stringify(animationIn);
      makeAnimation(animationName, animationIn);
      animationIn = animationName;
    }

    if (isObject(animationOut)) {
      const animationName = JSON.stringify(animationOut);
      makeAnimation(animationName, animationOut);
      animationOut = animationName;
    }

    this.animationIn = animationIn;
    this.animationOut = animationOut;
  };

  handleDimensionsUpdate = () => {
    // Here we update the device dimensions in the state if the layout changed (triggering a render)
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    if (
      deviceWidth !== this.state.deviceWidth ||
      deviceHeight !== this.state.deviceHeight
    ) {
      this.setState({ deviceWidth, deviceHeight });
    }
  };

  handleBackdropRef = ref => {
    this.backdropRef = ref;
    if (this.state.isVisible) {
      this.open();
    }
  };

  handleContentRef = ref => {
    this.contentRef = ref;
    if (this.state.isVisible) {
      this.open();
    }
  };

  open = () => {
    if (this.transitionLock) return;
    // For some reason the backdropRef and contentRef do not initialize before
    // componentDidMount is called so make sure not to try opening until the
    // refs are mounted
    // https://github.com/Dekoruma/react-native-web-modal/issues/5
    if (!(this.backdropRef && this.contentRef)) return;
    this.transitionLock = true;

    this.backdropRef.transitionTo(
      { opacity: this.props.backdropOpacity },
      this.props.backdropTransitionInTiming
    );

    // This is for reset the pan position, if not modal get stuck
    // at the last release position when you try to open it.
    // Could certainly be improve - no idea for the moment.
    if (this.state.isSwipeable) {
      this.state.pan.setValue({ x: 0, y: 0 });
    }

    this.contentRef[this.animationIn](this.props.animationInTiming).then(() => {
      this.transitionLock = false;
      if (!this.props.isVisible) {
        this._close();
      } else {
        this.props.onModalShow();
      }
    });
  };

  _close = () => {
    if (this.transitionLock) return;
    this.transitionLock = true;
    if (this.backdropRef) {
      this.backdropRef.transitionTo(
        { opacity: 0 },
        this.props.backdropTransitionOutTiming
      );
    }

    let animationOut = this.animationOut;

    if (this.inSwipeClosingState) {
      this.inSwipeClosingState = false;
      if (this.props.swipeDirection === 'up') {
        animationOut = 'slideOutUp';
      } else if (this.props.swipeDirection === 'down') {
        animationOut = 'slideOutDown';
      } else if (this.props.swipeDirection === 'right') {
        animationOut = 'slideOutRight';
      } else if (this.props.swipeDirection === 'left') {
        animationOut = 'slideOutLeft';
      }
    }

    if (this.contentRef) {
      this.contentRef[animationOut](this.props.animationOutTiming).then(() => {
        this.transitionLock = false;
        if (this.props.isVisible) {
          this.open();
        } else {
          this.setState(
            {
              showContent: false,
            },
            () => {
              this.setState({
                isVisible: false,
              });
            }
          );
          this.props.onModalHide();
        }
      });
    }
  };

  render() {
    const {
      animationIn,
      animationInTiming,
      animationOut,
      animationOutTiming,
      avoidKeyboard,
      backdropColor,
      backdropOpacity,
      backdropTransitionInTiming,
      backdropTransitionOutTiming,
      children,
      isVisible,
      onModalShow,
      onBackdropPress,
      onBackButtonPress,
      useNativeDriver,
      style,
      ...otherProps
    } = this.props;
    const { deviceWidth } = this.state;

    const computedStyle = [
      { margin: deviceWidth * 0.05, transform: [{ translateY: 0 }] },
      styles.content,
      style,
    ];

    let panHandlers = {};
    let panPosition = {};
    if (this.state.isSwipeable) {
      panHandlers = { ...this.panResponder.panHandlers };
      panPosition = this.state.pan.getLayout();
    }

    const _children =
      this.props.hideModalContentWhileAnimating &&
      this.props.useNativeDriver &&
      !this.state.showContent ? (
        <View />
      ) : (
        children
      );

    const containerView = (
      <View
        {...panHandlers}
        ref={this.handleContentRef}
        style={[panPosition, computedStyle]}
        pointerEvents="box-none"
        useNativeDriver={useNativeDriver}
        {...otherProps}>
        {_children}
      </View>
    );

    return (
      <Modal
        transparent
        animationType="none"
        visible={this.state.isVisible}
        onRequestClose={onBackButtonPress}
        {...otherProps}>
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View
            ref={this.handleBackdropRef}
            useNativeDriver={useNativeDriver}
            style={[
              styles.backdrop,
              {
                backgroundColor: this.state.showContent
                  ? backdropColor
                  : 'transparent',
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {avoidKeyboard && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            pointerEvents="box-none"
            style={computedStyle.concat([{ margin: 0 }])}>
            {containerView}
          </KeyboardAvoidingView>
        )}

        {!avoidKeyboard && containerView}
      </Modal>
    );
  }
}

export { ReactNativeModal };
export default ReactNativeModal;
