import React, {PropTypes, Component} from 'react';
import extractProps from '../lib/extract/extractProps';
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import {circleProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';
import _ from 'lodash';

class Circle extends Component{
    static displayName = 'Circle';
    static propTypes = {
        ...pathProps,
        ...circleProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...circleProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };

    //constructor() {
    //    super(...arguments);
    //    _.forEach(SvgTouchableMixin, (method, key) => {
    //        this[key] = method.bind(this);
    //    });
    //
    //    this.state = this.touchableGetInitialState();
    //};

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGCircle
            {...extractProps(props)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            r={props.r.toString()}
            //onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
            //onResponderTerminationRequest={this.touchableHandleResponderTerminationRequest}
            //onResponderGrant={this.touchableHandleResponderGrant}
            //onResponderMove={this.touchableHandleResponderMove}
            //onResponderRelease={this.touchableHandleResponderRelease}
            //onResponderTerminate={this.touchableHandleResponderTerminate}
        />;
    }
}

const RNSVGCircle = createNativeComponent('RNSVGCircle');

export default Circle;
