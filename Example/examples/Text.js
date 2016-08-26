import React, {
    Component
} from 'react';

import Svg, {
    Text,
    LinearGradient,
    Stop,
    Defs,
    Path,
    G
} from 'react-native-svg';

class TextExample extends Component{
    static title = 'Text';
    render() {
        return <Svg
            height="30"
            width="100"
        >
            <Text
                x="50"
                y="9"
                fill="red"
                textAnchor="middle"
            >I love SVG!</Text>
        </Svg>;
    }
}

class TextRotate extends Component{
    static title = 'Transform the text';

    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Text
                x="0"
                y="15"
                fill="red"
                rotate="30"
                origin="20,40"
            >I love SVG</Text>
            <Text
                x="95"
                y="47"
                fill="blue"
                rotate="-67"
            >I love SVG</Text>
            <Text
                x="126"
                y="24"
                fill="#f60"
                rotate="78"
                scale="1.36"
                origin="20, 0"
            >I love SVG</Text>
        </Svg>;
    }
}

// TODO: iOS not support text stroke with pattern
class TextStroke extends Component{
    static title = 'Stroke the text';
    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="100%" stopColor="red" stopOpacity="1" />
                    <Stop offset="0%" stopColor="#000" stopOpacity="0.5" />
                </LinearGradient>
            </Defs>
            <Text
                stroke="url(#grad)"
                strokeWidth="2"
                fill="none"
                fontSize="30"
                fontWeight="bold"
                x="100"
                y="20"
                textAnchor="middle"
            >STROKE TEXT</Text>
        </Svg>;
    }
}

class TextFill extends Component{
    static title = 'Fill the text with LinearGradient';
    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0.5" />
                    <Stop offset="100%" stopColor="red" stopOpacity="1" />
                </LinearGradient>
            </Defs>

            <Text
                fill="url(#grad)"
                stroke="purple"
                fontSize="20"
                fontWeight="bold"
                x="100"
                y="20"
                textAnchor="middle"
            >FILL TEXT</Text>
        </Svg>;
    }
}


class TextPath extends Component{
    static title = 'Draw text along path';

    render() {
        const path = `
                    M 10 20
                     C 20 10 30   0 40 10
                     C 50 20 60 30 70 20
                     C 80 10 90 10 90 10
                `;

        return <Svg
            height="60"
            width="200"
        >
            <G y="20">
                <Text
                    fill="blue"
                    path={path}
                >We go up, then we go down, then up again</Text>
                <Path
                    d={path}
                    fill="none"
                    stroke="red"
                    strokeWidth="1"
                />
            </G>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Text
        x="10"
        y="2"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="none"
        stroke="blue"
    >字</Text>
</Svg>;

const samples = [
    TextExample,
    TextRotate,
    TextStroke,
    TextFill,
    TextPath
];

export {
    icon,
    samples
};
