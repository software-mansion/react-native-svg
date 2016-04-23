import React, {
    Component
} from 'react-native';

import Svg, {
    Text,
    LinearGradient,
    Stop,
    Defs,
    ClipPath,
    Rect
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
                textAnchor="center"
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

class TextFill extends Component{
    static title = 'Fill the text with LinearGradient';
    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="200" y2="0">
                    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
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
                textAnchor="center"
            >FILL TEXT</Text>
        </Svg>;
    }
}

// TODO: not supported
class TextStroke extends Component{
    static title = 'Stroke the text';
    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="100" y2="0">
                    <Stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    <Stop offset="0%" stopColor="#000" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="200" height="60" fill="blue" />
            <Text
                stroke="url(#grad)"
                strokeWidth="4"
                fill="none"
                fontSize="20"
                fontWeight="bold"
                x="100"
                y="20"
                textAnchor="center"
            >STROKE TEXT</Text>
        </Svg>;
    }
}


class TextPath extends Component{
    static title = 'Transform the text';
    render() {
        return <Svg
            height="60"
            width="200"
        >
            <Text
                fill="red"
                path={`
                    M 10 20
                    C 20 10 30  0 40 10
                    C 50 20 60 30 70 20
                    C 80 10 90 10 90 10
                    C 110 20 120 30 120 20
                    C 140 10 150 10 150 10
                `}
                y="20"
            >We go up, then we go down, then up again</Text>
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
        textAnchor="center"
        fill="none"
        stroke="blue"
    >字</Text>
</Svg>;

const samples = [TextExample, TextRotate, TextFill, TextPath];

export {
    icon,
    samples
}
