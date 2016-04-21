import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';

class Polygon extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
    static getPath = props => (`M${props.points.trim().replace(/\s+/g, 'L')}z`);

    render() {
        return <Path
            {...this.props}
            d={Polygon.getPath(this.props)}
        />;
    }
}
export default Polygon;
