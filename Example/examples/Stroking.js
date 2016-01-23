import React, {
    Component
} from 'react-native';

import Svg, {
    Path,
    G
} from 'react-native-art-svg';

class StrokeExample extends Component{
    static title = 'The stroke property defines the color of a line, text or outline of an element';
    render() {
        return <Svg height="80" width="225">
            <G fill="none">
                <Path stroke="red" d="M5 20 l215 0" />
                <Path stroke="black" d="M5 40 l215 0" />
                <Path stroke="blue" d="M5 60 l215 0" />
            </G>
        </Svg>;
    }
}

class StrokeWidth extends Component{
    static title = 'The stroke property defines the color of a line, text or outline of an element';
    render() {
        return <Svg height="80" width="225">
            <G fill="none" stroke="black">
                <Path strokeWidth="2" d="M5 20 l215 0" />
                <Path strokeWidth="4" d="M5 40 l215 0" />
                <Path strokeWidth="6" d="M5 60 l215 0" />
            </G>
        </Svg>;
    }
}

class StrokeLinecap extends Component{
    static title = 'The stroke-linecap property defines different types of endings to an open path';
    render() {
        return <Svg height="80" width="225">
            <G fill="none" stroke="black" strokeWidth="6">
                <Path strokeLinecap="butt" d="M5 20 l215 0" />
                <Path strokeLinecap="round" d="M5 40 l215 0" />
                <Path strokeLinecap="square" d="M5 60 l215 0" />
            </G>
        </Svg>;
    }
}

class StrokeDasharray  extends Component{
    static title = 'The stroke-linecap property defines different types of endings to an open path';
    render() {
        return <Svg height="80" width="225">
            <G fill="none" stroke="black" strokeWidth="4">
                <Path strokeDasharray="5,5" d="M5 20 l215 0" />
                <Path strokeDasharray="10,10" d="M5 40 l215 0" />
                <Path strokeDasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
            </G>
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <G fill="none" stroke="black" strokeWidth="2">
        <Path strokeDasharray="2,2" d="M0 4 h20" />
        <Path strokeDasharray="4,4" d="M0 10 h20" />
        <Path strokeDasharray="4,2,1,1,1,6" d="M0 19 h20" />
    </G>
</Svg>;

const samples = [StrokeExample, StrokeWidth, StrokeLinecap, StrokeDasharray];

export {
    icon,
    samples
}
