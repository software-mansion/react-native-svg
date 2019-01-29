import { Component } from 'react';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';

const touchKeys = Object.keys(SvgTouchableMixin);
const touchVals = touchKeys.map(key => SvgTouchableMixin[key]);
const numTouchKeys = touchKeys.length;

export default class Shape extends Component {
  constructor() {
    super(...arguments);
    for (let i = 0; i < numTouchKeys; i++) {
      const key = touchKeys[i];
      const val = touchVals[i];
      if (typeof val === 'function') {
        this[key] = val.bind(this);
      } else {
        this[key] = val;
      }
    }
    this.state = this.touchableGetInitialState();
  }
  refMethod = ref => {
    this.root = ref;
  };
  setNativeProps = props => {
    this.root.setNativeProps(props);
  };
}
