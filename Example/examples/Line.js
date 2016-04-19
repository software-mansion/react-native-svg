import React, {
    Component
} from 'react-native';

import Svg, {
    Line
} from 'react-native-art-svg';

class LineExample extends Component{
    static title = 'Line';

    render() {
        return <Svg
            height="100"
            width="100"
        >
            <Line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="red"
                strokeWidth="2"
            />
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Line
        x1="0"
        y1="0"
        x2="20"
        y2="20"
        stroke="red"
        strokeWidth="1"
    />
</Svg>;

const samples = [LineExample];

export {
    icon,
    samples
}
