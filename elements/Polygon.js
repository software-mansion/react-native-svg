import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';
import Path from './Path';

class Polygon extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
    render() {
        let props = this.props;
        let d = 'M' + props.points.trim().replace(/\s+/g, 'L') + 'z';
        return <Path
            {...props}
            points={null}
            d={d}
        />;
    }
}
export default Polygon;
