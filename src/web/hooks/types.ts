type ClickEvent = any;
type ResponderEvent = any;
type KeyboardEvent = any;

export type PressResponderConfig = Readonly<{
  // The gesture can be interrupted by a parent gesture, e.g., scroll.
  // Defaults to true.
  cancelable?: boolean | null | undefined;
  // Whether to disable initialization of the press gesture.
  disabled?: boolean | null | undefined;
  // Duration (in addition to `delayPressStart`) after which a press gesture is
  // considered a long press gesture. Defaults to 500 (milliseconds).
  delayLongPress?: number | null | undefined;
  // Duration to wait after press down before calling `onPressStart`.
  delayPressStart?: number | null | undefined;
  // Duration to wait after letting up before calling `onPressEnd`.
  delayPressEnd?: number | null | undefined;
  // Called when a long press gesture has been triggered.
  onLongPress?: (event: ResponderEvent) => void | null | undefined;
  // Called when a press gestute has been triggered.
  onPress?: (event: ClickEvent) => void | null | undefined;
  // Called when the press is activated to provide visual feedback.
  onPressChange?: (event: ResponderEvent) => void | null | undefined;
  // Called when the press is activated to provide visual feedback.
  onPressStart?: (event: ResponderEvent) => void | null | undefined;
  // Called when the press location moves. (This should rarely be used.)
  onPressMove?: (event: ResponderEvent) => void | null | undefined;
  // Called when the press is deactivated to undo visual feedback.
  onPressEnd?: (event: ResponderEvent) => void | null | undefined;
}>;

export type EventHandlers = Readonly<{
  onClick: (event: ClickEvent) => void;
  onContextMenu: (event: ClickEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onResponderGrant: (event: ResponderEvent) => void;
  onResponderMove: (event: ResponderEvent) => void;
  onResponderRelease: (event: ResponderEvent) => void;
  onResponderTerminate: (event: ResponderEvent) => void;
  onResponderTerminationRequest: (event: ResponderEvent) => boolean;
  onStartShouldSetResponder: (event: ResponderEvent) => boolean;
}>;

export type ResponderConfig = {
  // Direct responder events dispatched directly to responder. Do not bubble.
  onResponderEnd?: (e: ResponderEvent) => void;
  onResponderGrant?: (e: ResponderEvent) => void | boolean;
  onResponderMove?: (e: ResponderEvent) => void;
  onResponderRelease?: (e: ResponderEvent) => void;
  onResponderReject?: (e: ResponderEvent) => void;
  onResponderStart?: (e: ResponderEvent) => void;
  onResponderTerminate?: (e: ResponderEvent) => void;
  onResponderTerminationRequest?: (e: ResponderEvent) => boolean;
  // On pointer down, should this element become the responder?
  onStartShouldSetResponder?: (e: ResponderEvent) => boolean;
  onStartShouldSetResponderCapture?: (e: ResponderEvent) => boolean;
  // On pointer move, should this element become the responder?
  onMoveShouldSetResponder?: (e: ResponderEvent) => boolean;
  onMoveShouldSetResponderCapture?: (e: ResponderEvent) => boolean;
  // On scroll, should this element become the responder? Do no bubble
  onScrollShouldSetResponder?: (e: ResponderEvent) => boolean;
  onScrollShouldSetResponderCapture?: (e: ResponderEvent) => boolean;
  // On text selection change, should this element become the responder?
  onSelectionChangeShouldSetResponder?: (e: ResponderEvent) => boolean;
  onSelectionChangeShouldSetResponderCapture?: (e: ResponderEvent) => boolean;
};
