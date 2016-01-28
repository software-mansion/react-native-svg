import React, {
    Component
} from 'react-native';

import Svg, {
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    Ellipse,
    Circle,
    Text
} from 'react-native-art-svg';

class LinearGradientHorizontal extends Component{
    static title = 'Define an ellipse with a horizontal linear gradient from yellow to red';
    render() {
        return <Svg
            height="150"
            width="300"
        >
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
                    <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="0" />
                    <Stop offset="1" stopColor="red" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class LinearGradientVertical  extends Component{
    static title = 'Define an ellipse with a horizontal linear gradient from yellow to red';
    render() {
        return <Svg
            height="150"
            width="300"
        >
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="150">
                    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
                    <Stop offset="100%" stopColor="red" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class LinearGradientPercent extends Component{
    static title = 'Define a linear gradient in percent unit';
    render() {
        return <Svg
            height="150"
            width="300"
        >
            <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
                    <Stop offset="100%" stopColor="red" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Text x="25" y="70" fill="#333">x1=0%</Text>
            <Text x="235" y="70" fill="#333">x2=100%</Text>
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class RadialGradientExample  extends Component{
    static title = 'Define an ellipse with a radial gradient from yellow to purple';
    render() {
        return <Svg
            height="150"
            width="300"
        >
            <Defs>
                <RadialGradient id="grad" cx="150" cy="75" rx="85" ry="55" fx="150" fy="75">
                    <Stop
                        offset="0"
                        stopColor="#ff0"
                        stopOpacity="1"
                    />
                    <Stop
                        offset="1"
                        stopColor="#83a"
                        stopOpacity="1"
                    />
                </RadialGradient>
            </Defs>
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class RadialGradientPart extends Component{
    static title = 'Define another ellipse with a radial gradient from white to blue';
    render() {
        return <Svg
            height="150"
            width="300"
        >
            <Defs>
                <RadialGradient id="grad" cx="60" cy="45" rx="34" ry="33" fx="150" fy="75">
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
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class RadialGradientPercent extends Component{
    static title = 'Define a radial gradient in percent unit';
    render() {
        return <Svg
            height="150"
            width="300"
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
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
        </Svg>;
    }
}

class FillGradientWithOpacity extends Component{
    static title = 'Fill a radial gradient with fillOpacity prop';
    render() {
        return <Svg
            height="150"
            width="300"
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
            <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" fillOpacity="0.2" />
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="20">
            <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0" />
            <Stop offset="100%" stopColor="red" stopOpacity="1" />
        </LinearGradient>
    </Defs>
    <Circle cx="10" cy="10" r="10" fill="url(#grad)" />
</Svg>;


const samples = [
    LinearGradientHorizontal,
    LinearGradientVertical,
    LinearGradientPercent,
    RadialGradientExample,
    RadialGradientPercent,
    RadialGradientPart,
    FillGradientWithOpacity
];

export {
    icon,
    samples
};
