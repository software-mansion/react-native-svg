import { Component } from "react";
import SvgTouchableMixin from "../lib/SvgTouchableMixin";
import _ from "lodash";

class Shape extends Component {
    constructor() {
        super(...arguments);
        _.forEach(SvgTouchableMixin, (val, key) => {
            if (typeof val === 'function') {
                this[key] = val.bind(this);
            } else {
                this[key] = val;
            }
        });
        //noinspection JSUnusedGlobalSymbols
        this.state = this.touchableGetInitialState();
    }
}

export default Shape;
