import {Component} from 'react';
import extractProps from '../lib/extract/extractProps';
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

    extractProps = (props, options) => {
        let extractedProps = extractProps(props, options);
        if (extractedProps.touchable && !extractedProps.disabled) {
            _.assign(extractedProps, {
                onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
                onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
                onResponderGrant: this.touchableHandleResponderGrant,
                onResponderMove: this.touchableHandleResponderMove,
                onResponderRelease: this.touchableHandleResponderRelease,
                onResponderTerminate: this.touchableHandleResponderTerminate
            });
        }

        return extractedProps;
    }
}

export default Shape;
