import React, {
    Component
} from 'react-native';

import Svg, {
    Symbol,
    Circle,
    Use
} from 'react-native-art-svg';

class SymbolExample extends Component{
    static title = 'Symbol example';
    render() {
        return <Svg
            height="150"
            width="110"
        >
            <Symbol id="symbol" viewbox="0 0 150 110" width="100" height="50">
                <Circle cx="50" cy="50" r="40" strokeWidth="8" stroke="red" fill="red"/>
                <Circle cx="90" cy="60" r="40" strokeWidth="8" stroke="green" fill="white"/>
            </Symbol>

            <Use
                href="#symbol"
                x="0"
                y="0"
            />
            <Use
                href="#symbol"
                x="0"
                y="50"
                width="75"
                height="38"
            />
            <Use
                href="#symbol"
                x="0"
                y="100"
                width="50"
                height="25"
            />
        </Svg>;
    }
}

const icon = <Svg
    height="20"
    width="20"
>
    <Symbol id="symbol" viewbox="0 0 150 110">
        <Circle cx="50" cy="50" r="40" strokeWidth="8" stroke="red" fill="red"/>
        <Circle cx="90" cy="60" r="40" strokeWidth="8" stroke="green" fill="white"/>
    </Symbol>

    <Use
        href="#symbol"
        x="0"
        y="0"
        width="20"
        height="10"
    />
    <Use
        href="#symbol"
        x="0"
        y="12"
        width="20"
        height="8"
    />
</Svg>;

const samples = [SymbolExample];

export {
    icon,
    samples
}
