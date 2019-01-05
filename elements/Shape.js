import { Component } from "react";
import SvgTouchableMixin from "../lib/SvgTouchableMixin";

const touch = Object.entries(SvgTouchableMixin);

class Shape extends Component {
    constructor() {
        super(...arguments);
        for (let [key, val] of touch) {
            if (typeof val === "function") {
                this[key] = val.bind(this);
            } else {
                this[key] = val;
            }
        }
        //noinspection JSUnusedGlobalSymbols
        this.state = this.touchableGetInitialState();
    }
}

export default Shape;
