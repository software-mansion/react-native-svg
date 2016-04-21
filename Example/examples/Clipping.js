import React, {
    Component
} from 'react-native';

import Svg, {
    ClipPath,
    Defs,
    RadialGradient,
    Stop,
    Line,
    Rect,
    Text,
    G
} from 'react-native-art-svg';

class ClipPathExample extends Component{
    static title = 'Clip by set clip-path with a path data';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Defs>
                <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                    <Stop
                        offset="0%"
                        stopColor="#fff"
                        stopOpacity="1"
                    />
                    <Stop
                        offset="100%"
                        stopColor="#00f"
                        stopOpacity="1"
                    />
                </RadialGradient>
            </Defs>
            <Rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill="url(#grad)"
                clipPath="M50,5L20,99L95,39L5,39L80,99z"
            />
        </Svg>;
    }
}

class ClipRulePathExample extends Component{
    static title = 'Clip a group with clipRule="evenodd"';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <G
                clipPath="M50,5L20,99L95,39L5,39L80,99z"
                clipRule="evenodd"
            >
                <Rect
                    x="0"
                    y="0"
                    width="50"
                    height="50"
                    fill="red"
                />
                <Rect
                    x="50"
                    y="0"
                    width="50"
                    height="50"
                    fill="blue"
                />
                <Rect
                    x="0"
                    y="50"
                    width="50"
                    height="50"
                    fill="yellow"
                />
                <Rect
                    x="50"
                    y="50"
                    width="50"
                    height="50"
                    fill="green"
                />
            </G>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <G
        clipPath="M50,5L20,99L95,39L5,39L80,99z"
        clipRule="evenodd"
        scale="0.2"
    >
        <G>
            <Rect
                x="0"
                y="0"
                width="50"
                height="50"
                fill="red"
            />
            <Rect
                x="50"
                y="0"
                width="50"
                height="50"
                fill="blue"
            />
            <Rect
                x="0"
                y="50"
                width="50"
                height="50"
                fill="yellow"
            />
            <Rect
                x="50"
                y="50"
                width="50"
                height="50"
                fill="green"
            />
        </G>
    </G>
</Svg>;

const samples = [ClipPathExample, ClipRulePathExample];

export {
    icon,
    samples
}
