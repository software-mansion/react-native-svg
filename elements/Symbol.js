import React, {Component} from 'react';
import PropTypes from 'prop-types';
import extractViewBox from '../lib/extract/extractViewBox';
import createReactNativeComponentClass from '../lib/createReactNativeComponentClass';
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

const RNSVGSymbol = createReactNativeComponentClass('RNSVGSymbol', () => ({
    validAttributes: SymbolAttributes,
    uiViewClassName: 'RNSVGSymbol'
}));
