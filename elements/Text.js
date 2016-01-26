import React, {
    ART,
    Component,
    PropTypes
} from 'react-native';

let {
    Text:ARTText
} = ART;
import Defs from './Defs';

import fillFilter from '../lib/fillFilter';
import strokeFilter from '../lib/strokeFilter';
import transformFilter from '../lib/transformFilter';

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

        if (this.props.id) {
            return <Defs.Item
                id={this.props.id}
                svgId={this.props.svgId}
                visible={true}
                text={true}
            >
                <Text {...this.props} id={null} />
            </Defs.Item>;
        }

        // TODO: support percent gradients
        return <ARTText
            {...props}
            {...transformFilter(props)}
            {...strokeFilter(props)}
            fill={fillFilter(props)}
            font={{
                fontSize: props.fontSize || 12,
                fontFamily: props.fontFamily || fontFamily,
                fontWeight: props.fontWeight,
                fontStyle: props.fontStyle
            }}
            alignment={props.textAnchor || props.alignment}
            x={x}
            y={y}
            id={null}
        />;
    }
}

export default Text;
