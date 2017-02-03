import React, {Component, PropTypes} from 'react';
import extractViewBox from '../lib/extract/extractViewBox';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {SymbolAttributes} from '../lib/attributes';

export default class extends Component{
    static displayName = 'Symbol';
    static propTypes = {
        id: PropTypes.string.isRequired,
        viewBox: PropTypes.string,
        preserveAspectRatio: PropTypes.string
    };
    render() {
        let {props} = this;

        return <RNSVGSymbol
            name={props.id}
            {...extractViewBox(props)}
        >
            {props.children}
        </RNSVGSymbol>;
    }
}

const RNSVGSymbol = createReactNativeComponentClass({
    validAttributes: SymbolAttributes,
    uiViewClassName: 'RNSVGSymbol'
});
