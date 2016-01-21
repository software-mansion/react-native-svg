import React, {
    Component
} from 'react-native';

import Svg, {
    Path
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
                d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 L25"
                fill="none"
                stroke="red"
            />
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

const samples = [PathExample, UnclosedPath];

export {
    icon,
    samples
}
