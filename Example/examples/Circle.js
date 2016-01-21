import React, {
    Component
} from 'react-native';

import Svg, {
    Circle
} from 'react-native-art-svg';

class CircleExample extends Component{
    static title = 'Circle';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Circle
                cx="50"
                cy="50"
                r="50"
                fill="pink"
            />
        </Svg>;
    }
}

class StrokeCircle extends Component{
    static title = 'Stroke Circle';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="purple"
                strokeWidth="2.5"
                fill={null}
            />
        </Svg>;
    }
}

class StrokeOpacityCircle extends Component{
    static title = 'Circle with strokeOpacity';
    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Circle
                cx="50"
                cy="50"
                r="40"
                stroke="purple"
                strokeOpacity="0.5"
                strokeWidth="10"
                fill="pink"
            />
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
        stroke="purple"
        strokeWidth="1"
        fill="pink"
    />
</Svg>;

const samples = [CircleExample, StrokeCircle, StrokeOpacityCircle];

export {
    icon,
    samples
}
