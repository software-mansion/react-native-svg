import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';
let {
    Surface,
    Shape
} = ART;



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
