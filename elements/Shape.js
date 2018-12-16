import { Component } from "react";
import SvgTouchableMixin from "../lib/SvgTouchableMixin";
import _ from "lodash";

class Shape extends Component {
    constructor() {
        super(...arguments);
        _.forEach(SvgTouchableMixin, (method, key) => {
            if (typeof method === 'function') {
                this[key] = method.bind(this);
            } else {
                this[key] = method;
            }
        });
        //noinspection JSUnusedGlobalSymbols
        this.state = this.touchableGetInitialState();
    }
}

export default Shape;
