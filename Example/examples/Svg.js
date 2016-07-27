import {
    StyleSheet,
    View
} from 'react-native';

import React, {
    Component
} from 'react';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        width: 200
    },
    svg: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

import Svg, {
    Circle,
    Rect,
    Path,
    Line,
    G
} from 'react-native-svg';

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
    static title = 'SVG with `viewBox="40 20 100 40" and preserveAspectRatio="none"`';
    render() {
        return <Svg
            height="100"
            width="100"
            viewBox="40 20 100 40"
            preserveAspectRatio="none"
        >
            <G>
                <Rect x="0" y="0" width="100" height="100" fill="red" />
                <Circle cx="50" cy="50" r="30" fill="yellow" />
                <Circle cx="40" cy="40" r="4" fill="black" />
                <Circle cx="60" cy="40" r="4" fill="black" />
                <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
            </G>
        </Svg>;
    }
}

class NullComponent extends Component {
    render() {
        return null;
    }
}

class SvgLayout extends Component{
    static title = 'SVG with flex layout';
    render() {
        return <View style={styles.container}>
            <Svg style={styles.svg}>
                <G>
                    <NullComponent />
                </G>
                <NullComponent />
                <Rect
                    width="80%"
                    height="80%"
                    x="10%"
                    y="10%"
                    fill="purple"
                    stroke="yellow"
                    strokeWidth="4"
                />
                <Line
                    x1="10%"
                    y1="10%"
                    x2="90%"
                    y2="90%"
                    stroke="yellow"
                    strokeWidth="4"
                />
                <Line
                    x1="10%"
                    y1="90%"
                    x2="90%"
                    y2="10%"
                    stroke="yellow"
                    strokeWidth="4"
                />
            </Svg>
        </View>;
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

const samples = [SvgExample, SvgOpacity, SvgViewbox, SvgLayout];

export {
    icon,
    samples
};
