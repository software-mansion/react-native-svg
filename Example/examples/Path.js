import React, {
    Component
} from 'react-native';

import Svg, {
    Path,
    G,
    Circle,
    Text
} from 'react-native-art-svg';

class PathExample extends Component{
    static title = 'Path';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Path
                d="M50 0 L15 100 L85 100 Z"
            />
        </Svg>;
    }
}

class UnclosedPath extends Component{
    static title = 'Unclosed paths';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Path
                d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
                fill="none"
                stroke="red"
            />
        </Svg>;
    }
}

class BezierCurve extends Component{
    static title = 'The following example creates a quadratic Bézier curve, where A and C are the start and end points, B is the control point';
    render() {
        return <Svg
            height="200"
            width="225"
        >
            <G scale="0.5">
                <Path
                    d="M 100 350 l 150 -300"
                    stroke="red"
                    strokeWidth="3"
                    fill="none"
                />
                <Path
                    d="M 250 50 l 150 300"
                    stroke="red"
                    strokeWidth="3"
                    fill="none"
                />
                <Path
                    d="M 175 200 l 150 0"
                    stroke="green"
                    strokeWidth="3"
                    fill="none"
                />
                <Path
                    d="M 100 350 q 150 -300 300 0"
                    stroke="blue"
                    strokeWidth="5"
                    fill="none"
                />
                <G
                    stroke="purple"
                    strokeWidth="3"
                    fill="purple"
                    r="3"
                >
                    <Circle cx="100" cy="350" />
                    <Circle cx="250" cy="50" />
                    <Circle cx="400" cy="350" />
                </G>
                <G
                    fontSize="30"
                    fill="black"
                    stroke="none"
                    textAnchor="middle"
                >
                    <Text x="100" y="350" dx="-30">A</Text>
                    <Text x="250" y="50" dy="-50">B</Text>
                    <Text x="400" y="350" dx="10">C</Text>
                </G>

            </G>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Path
        d="M5 0 L8 10 L10 15 L18 2 L4 18 L5 14 L10 10 Z"
        stroke="red"
        fill="none"
    />
</Svg>;

const samples = [PathExample, UnclosedPath, BezierCurve];

export {
    icon,
    samples
}
