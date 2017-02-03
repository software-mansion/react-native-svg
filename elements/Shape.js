import {Component} from 'react';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';
import _ from 'lodash';

class Shape extends Component {
    constructor() {
        super(...arguments);
        _.forEach(SvgTouchableMixin, (method, key) => {
            this[key] = method.bind(this);
        });
        this.state = this.touchableGetInitialState();
    }
}

export default Shape;
