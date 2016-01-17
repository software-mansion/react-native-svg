import React, {
    Component,
    PropTypes
} from 'react-native';
import {
    Surface,
    Shape
} from 'ReactNativeART';


class Polyline extends Component{
    static displayName = 'Polyline';
    static propTypes = {
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    };
    render() {
        let props = this.props;
        let d = 'M' + props.points.trim().replace(/\s+/g, 'L');
        return <Shape
            {...props}
            points={null}
            fill={null}
            d={d}
        />;
    }
}
export default Polyline;
