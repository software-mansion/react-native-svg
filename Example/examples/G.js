import React, {
    Component
} from 'react-native';

import Svg, {
    G,
    Circle,
    Line,
    Rect,
    Text
} from 'react-native-art-svg';

class GExample extends Component{
    static title = 'G children props inherit';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <G
                r="11"
                fill="purple"
                stroke="pink"
                strokeWidth="3"
            >
                <Circle
                    cx="25"
                    cy="25"
                />
                <Circle
                    cx="25"
                    cy="75"
                />
                <Circle
                    cx="50"
                    cy="50"
                    fill="green"
                />
                <Circle
                    cx="75"
                    cy="25"
                />
                <Circle
                    cx="75"
                    cy="75"
                />
            </G>
        </Svg>;
    }
}

class GTransform extends Component{
    static title = 'G transform';
    render() {
        return <Svg
            height="100"
            width="200"
        >
            <G
                rotate="50"
                origin="100, 50"
            >
                <Line
                    x1="60"
                    y1="10"
                    x2="140"
                    y2="10"
                    stroke="#060"
                />

                <Rect
                    x="60"
                    y="20"
                    height="50"
                    width="80"
                    stroke="#060"
                    fill="#060"
                />

                <Text
                    x="100"
                    y="75"
                    stroke="#600"
                    fill="#600"
                    textAnchor="center"
                >
                    Text grouped with shapes</Text>
            </G>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <G
        r="3"
        fill="purple"
        stroke="pink"
    >
        <Circle
            cx="5"
            cy="5"
        />
        <Circle
            cx="5"
            cy="15"
        />
        <Circle
            cx="10"
            cy="10"
            fill="green"
        />
        <Circle
            cx="15"
            cy="5"
        />
        <Circle
            cx="15"
            cy="15"
        />
    </G>
</Svg>;

const samples = [GExample, GTransform];

export {
    icon,
    samples
}
