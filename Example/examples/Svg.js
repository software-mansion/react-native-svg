import React, {
    Component
} from 'react-native';

import Svg, {
    Circle,
    Rect,
    Path
} from 'react-native-art-svg';

class SvgExample extends Component{
    static title = 'SVG';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="blue"
                strokeWidth="2.5"
                fill="green"
            />
            <Rect
                x="15"
                y="15"
                width="70"
                height="70"
                stroke="red"
                strokeWidth="2"
                fill="yellow"
            />
        </Svg>;
    }
}

class SvgOpacity extends Component{
    static title = 'SVG with `opacity` prop';
    render() {
        return <Svg
            height="100"
            width="100"
            opacity="0.2"
        >
            <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="blue"
                strokeWidth="2.5"
                fill="green"
            />
            <Rect
                x="15"
                y="15"
                width="70"
                height="70"
                stroke="red"
                strokeWidth="2"
                fill="yellow"
            />
        </Svg>;
    }
}

class SvgViewbox extends Component{
    static title = 'SVG with `viewbox="40 20 100 40"`';
    render() {
        return <Svg
            height="100"
            width="100"
            viewbox="40 20 100 40"
            preserveAspectRatio="none"
        >
            <Rect x="0" y="0" width="100" height="100" fill="black" />
            <Circle cx="50" cy="50" r="30" fill="yellow" />
            <Circle cx="40" cy="40" r="4" fill="black" />
            <Circle cx="60" cy="40" r="4" fill="black" />
            <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Circle
        cx="10"
        cy="10"
        r="8"
        stroke="blue"
        strokeWidth="1"
        fill="green"
    />
    <Rect
        x="4"
        y="4"
        width="12"
        height="12"
        stroke="red"
        strokeWidth="1"
        fill="yellow"
    />
</Svg>;

const samples = [SvgExample, SvgOpacity ,SvgViewbox];

export {
    icon,
    samples
}
