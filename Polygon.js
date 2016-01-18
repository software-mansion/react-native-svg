import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';
let {
    Surface,
    Shape,
    Group
} = ART;
import fillFilter from './lib/fillFilter';

class Polygon extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    };
    render() {
        let props = this.props;
        let d = 'M' + props.points.trim().replace(/\s+/g, 'L') + 'z';
        return <Shape
            {...props}
            fill={fillFilter(props)}
            points={null}
            d={d}
        />;
    }
}
export default Polygon;
