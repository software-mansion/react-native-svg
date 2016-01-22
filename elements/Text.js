import React, {
    ART,
    Component,
    PropTypes
} from 'react-native';

let {
    Text:ARTText,
    Shape
} = ART;

import fillFilter from '../lib/fillFilter';
import strokeFilter from '../lib/strokeFilter';
class Text extends Component{
    static displayName = 'Text';
    static propTypes = {
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeJoin: PropTypes.oneOf(['miter', 'bevel', 'round'])
    };
    render() {
        let {props} = this;
        return <Shape d="M0, 0 L0, 0Z" />;

        return <ARTText
            {...props}
            strokeCap={props.strokeLinecap || props.strokeCap || 'square'}
            strokeJoin={props.strokeLinejoin || props.strokeJoin || 'miter'}
            alignment={props.textAnchor || props.alignment}
            fill={fillFilter(props)}
            stroke={strokeFilter(props)}
        />;
    }
}

export default Text;
