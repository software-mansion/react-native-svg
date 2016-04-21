import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';

class Polyline extends Component{
    static displayName = 'Polyline';
    static propTypes = {
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeJoin: PropTypes.oneOf(['miter', 'bevel', 'round'])
    };
    static getPath = props => (`M${props.points.trim().replace(/\s+/g, 'L')}`);

    render() {
        return <Path
            {...this.props}
            d={Polyline.getPath(this.props)}
        />;
    }
}
export default Polyline;
