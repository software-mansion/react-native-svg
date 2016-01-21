import React, {
    ART,
    Component
} from 'react-native';

let {
    Surface
} = ART;

class Svg extends Component{
    static displayName = 'Svg';
    render() {
        let opacity = +this.props.opacity;

        return <Surface
            {...this.props}
            style={[
                this.props.style,
                !isNaN(opacity) && {
                    opacity: opacity
                }
            ]}
        />;
    }
}

export default Svg;
