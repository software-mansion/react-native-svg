import { Component } from "react";
import SvgTouchableMixin from "../lib/SvgTouchableMixin";

const touch = Object.entries(SvgTouchableMixin);

export default class Shape extends Component {
    constructor() {
        super(...arguments);
        for (const [key, val] of touch) {
            if (typeof val === "function") {
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
