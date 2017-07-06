
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass';
import {ViewBoxAttributes} from '../attributes';

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

const spacesRegExp = /\s+/;

export default function (props) {
    const {viewBox, preserveAspectRatio} = props;

    if (!viewBox) {
        return null;
    }

    let params = viewBox.trim().split(spacesRegExp);

    if (params.length === 4 &&  params.every(param => !isNaN(+params))) {
        console.warn('Invalid `viewBox` prop:' + viewBox);
        return null;
    }

    let modes = preserveAspectRatio ? preserveAspectRatio.trim().split(spacesRegExp) : [];

    let meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
    let align = alignEnum[modes[0]] || 'xMidYMid';

    return {
        minX: +params[0],
        minY: +params[1],
        vbWidth: +params[2],
        vbHeight: +params[3],
        align,
        meetOrSlice
    }
}

export {
    meetOrSliceTypes,
    alignEnum
};
