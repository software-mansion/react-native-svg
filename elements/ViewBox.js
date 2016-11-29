import React, {Component, PropTypes} from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {ViewBoxAttributes} from '../lib/attributes';
import G from './G';

const meetOrSliceTypes = {
    meet: 0,
    slice: 1,
    none: 2
};

const alignEnum = [
    'xMinYMin', 'xMidYMin', 'xMaxYMin',
    'xMinYMid', 'xMidYMid', 'xMaxYMid',
    'xMinYMax', 'xMidYMax', 'xMaxYMax',
    'none'
].reduce((prev, name) => {
    prev[name] = name;
    return prev;
}, {});

const numberRegExp = /^\d*\.?\d*%?$/;
const spacesRegExp = /\s+/;

class ViewBox extends Component{
    static displayName = 'ViewBox';

    static propTypes = {
        viewBox: PropTypes.string.isRequired,
        preserveAspectRatio: PropTypes.string
    };

    static defaultProps = {
        preserveAspectRatio: 'xMidYMid meet'
    };

    render() {
        const {viewBox, preserveAspectRatio, name} = this.props;

        let params = viewBox.trim().split(spacesRegExp);

        if (params.length !== 4 || !params.some(param => param && numberRegExp.test(param))) {
            console.warn('`viewBox` expected a string like `minX minY width height`, but got:' + viewBox);
            return <G>
                {this.props.children}
            </G>;
        }

        let modes = preserveAspectRatio.trim().split(spacesRegExp);

        let meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
        let align = alignEnum[modes[0]] || 'xMidYMid';

        return <RNSVGViewBox
            name={name}
            minX={params[0]}
            minY={params[1]}
            vbWidth={params[2]}
            vbHeight={params[3]}
            align={align}
            meetOrSlice={meetOrSlice}
        >
            {this.props.children}
        </RNSVGViewBox>;
    }
}

const RNSVGViewBox = createReactNativeComponentClass({
    validAttributes: ViewBoxAttributes,
    uiViewClassName: 'RNSVGViewBox'
});


export default ViewBox;

export {
    meetOrSliceTypes,
    alignEnum
};
