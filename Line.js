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

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired;

class Line extends Component{
    static displayName = 'Line';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType
    };
    render() {
        let {x1,y1,x2,y2} = this.props;
        let d = `M${x1},${y1}L${x2},${y2}Z`;
        return <Shape
            {...this.props}
            x1={null}
            y1={null}
            x2={null}
            y2={null}
            fill="null"
            d={d}
        />;
    }
}

export default Line;
