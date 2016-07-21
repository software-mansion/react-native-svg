import React, {
    Component
} from 'react';

import Svg, {
    Defs,
    G,
    Path,
    Use,
    Rect,
    Circle,
    ClipPath,
    LinearGradient,
    RadialGradient,
    Stop
} from 'react-native-svg';

class DefsExample extends Component{
    static title = 'basic Defs usage';

    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Defs>
                <G id="path" x="5" y="2" opacity="0.9">
                    <Path id="test" d="M38.459,1.66A0.884,0.884,0,0,1,39,2.5a0.7,0.7,0,0,1-.3.575L23.235,16.092,27.58,26.1a1.4,1.4,0,0,1,.148.3,1.3,1.3,0,0,1,0,.377,1.266,1.266,0,0,1-2.078.991L15.526,20.6l-7.58,4.35a1.255,1.255,0,0,1-.485,0,1.267,1.267,0,0,1-1.277-1.258q0-.01,0-0.02a1.429,1.429,0,0,1,0-.446C7.243,20.253,8.6,16.369,8.6,16.29L3.433,13.545A0.743,0.743,0,0,1,2.9,12.822a0.822,0.822,0,0,1,.623-0.773l8.164-2.972,3.018-8.5A0.822,0.822,0,0,1,15.427,0a0.752,0.752,0,0,1,.752.555l2.563,6.936S37.65,1.727,37.792,1.685A1.15,1.15,0,0,1,38.459,1.66Z" />
                </G>
                <ClipPath id="clip">
                    <Circle r="25%" cx="0%" cy="0%" />
                </ClipPath>
                <LinearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="yellow" />
                    <Stop offset="50%" stopColor="red" />
                    <Stop offset="100%" stopColor="blue" />
                </LinearGradient>
                <RadialGradient id="radial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <Stop offset="0%" stopColor="yellow" />
                    <Stop offset="50%" stopColor="red" />
                    <Stop offset="100%" stopColor="blue" />
                </RadialGradient>
            </Defs>
            <Use href="url(#path)" x="0" fill="blue" opacity="0.6" />
            <Use href="url(#path)" x="20" y="5" fill="url(#linear)" />
            <Use href="url(#path)" clipPath="url(#clip)" fillOpacity="0.6" stroke="#000" />
            <Use href="url(#path)" x="-10" y="20" fill="red"  fill="url(#radial)" />
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Defs>
        <G id="path" scale="0.5">
            <Path fill='red' d="M38.459,1.66A0.884,0.884,0,0,1,39,2.5a0.7,0.7,0,0,1-.3.575L23.235,16.092,27.58,26.1a1.4,1.4,0,0,1,.148.3,1.3,1.3,0,0,1,0,.377,1.266,1.266,0,0,1-2.078.991L15.526,20.6l-7.58,4.35a1.255,1.255,0,0,1-.485,0,1.267,1.267,0,0,1-1.277-1.258q0-.01,0-0.02a1.429,1.429,0,0,1,0-.446C7.243,20.253,8.6,16.369,8.6,16.29L3.433,13.545A0.743,0.743,0,0,1,2.9,12.822a0.822,0.822,0,0,1,.623-0.773l8.164-2.972,3.018-8.5A0.822,0.822,0,0,1,15.427,0a0.752,0.752,0,0,1,.752.555l2.563,6.936S37.65,1.727,37.792,1.685A1.15,1.15,0,0,1,38.459,1.66Z"/>
        </G>
    </Defs>
    <Use href="url(#path)" fill="#3a8" />
</Svg>;



const samples = [DefsExample];

export {
    icon,
    samples
};
