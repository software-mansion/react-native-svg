import React, {
    Component,
    PropTypes
} from 'react-native';
import Ellipse from './Ellipse';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class Circle extends Component{
    static displayName = 'Circle';
    static propTypes = {
        cx: propType,
        cy: propType,
        r: propType
    };
    static defaultProps = {
        cx: 0,
        cy: 0
    };

    render() {
        return <Ellipse
            {...this.props}
            r={null}
            rx={+this.props.r}
            ry={+this.props.r}
        />
    }
}

export default Circle;
