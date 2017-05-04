import {Component} from 'react';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';
import extractProps from '../lib/extract/extractProps';
import _ from 'lodash';

class Shape extends Component {
    constructor() {
        super(...arguments);
        _.forEach(SvgTouchableMixin, (method, key) => {
            this[key] = method.bind(this);
        });
        this.state = this.touchableGetInitialState();
    }

    setNativeProps = (args) => {
        var extracted = extractProps(args, this)
        for(var key in args) {
          if (extracted[key]) {
            args[key] = extracted[key]
          }
        }
        this.root.setNativeProps(args);
    };

}

export default Shape;
