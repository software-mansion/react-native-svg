import { Component } from "react";
import SvgTouchableMixin from "../lib/SvgTouchableMixin";

class Shape extends Component {
    constructor() {
        super(...arguments);
        for (let key of Object.keys(SvgTouchableMixin)) {
            const method = SvgTouchableMixin[key];
            if (typeof method === 'function') {
                this[key] = method.bind(this);
            } else {
                this[key] = method;
            }
        }
        //noinspection JSUnusedGlobalSymbols
        this.state = this.touchableGetInitialState();
    }
}

export default Shape;
