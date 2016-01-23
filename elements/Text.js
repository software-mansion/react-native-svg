import React, {
    ART,
    Component,
    PropTypes
} from 'react-native';

let {
    Text:ARTText
} = ART;

import fillFilter from '../lib/fillFilter';
import strokeFilter from '../lib/strokeFilter';

const fontFamily = '"Helvetica Neue", "Helvetica", Arial';
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

        let x = 0;
        if (props.x) {
            x = props.dx ? +props.x + (+props.dx) : +props.x;
        }
        let y = 0;
        if (props.y) {
            y = props.dy ? +props.y + (+props.dy) : +props.y;
        }

        let coords = props.origin ? props.origin.split(',') : [];

        let originX = coords.length === 2 ? coords[0] : props.originX;
        let originY = coords.length === 2 ? coords[1] :props.originY;

        return  <ARTText
            {...props}
            font={{
                fontSize: props.fontSize || 12,
                fontFamily: props.fontFamily || fontFamily,
                fontWeight: props.fontWeight,
                fontStyle: props.fontStyle
            }}
            rotation={props.rotation || props.rotate || 0}
            scale={props.scale || 1}
            originX={originX}
            originY={originY}
            strokeCap={props.strokeLinecap || props.strokeCap || 'square'}
            strokeJoin={props.strokeLinejoin || props.strokeJoin || 'miter'}
            alignment={props.textAnchor || props.alignment}
            fill={fillFilter(props)}
            stroke={strokeFilter(props)}
            x={x}
            y={y}
        />;
    }
}

export default Text;
