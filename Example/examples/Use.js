import React, {
    Component
} from 'react-native';

import Svg, {
    Defs,
    Use,
    G,
    Rect,
    Circle
} from 'react-native-art-svg';

class UseExample extends Component{
    static title = 'Reuse svg code';
    render() {
        return <Svg
            height="100"
            width="300"
        >
            <Defs>
                <G id="shape">
                    <G>
                        <Circle cx="50" cy="50" r="50" />
                        <Rect x="50" y="50" width="50" height="50" />
                        <Circle cx="50" cy="50" r="5" fill="blue" />
                    </G>
                </G>
            </Defs>
            <Use href="#shape" x="20" y="0"/>
            <Use href="#shape" x="170"y="0" />
        </Svg>;
    };
}

class UseShapes extends Component{
    static title = 'Using Shapes Outside of a Defs Element';
    render() {
        return <Svg
            height="110"
            width="200"
        >
            <G id="shape">
                <Rect x="0" y="0" width="50" height="50" />
            </G>

            <Use href="#shape" x="75" y="50" fill="#0f0"/>
            <Use href="#shape" x="150" y="50" stroke="#0f0" fill="none"/>
        </Svg>;
    };
}

const icon = <Svg
    height="20"
    width="20"
>

</Svg>;

const samples = [UseExample, UseShapes];

export {
    icon,
    samples
}
