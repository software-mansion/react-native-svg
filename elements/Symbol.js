import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';

import ViewBox from './ViewBox';
import Defs from './Defs';
import extractViewbox from '../lib/extractViewbox';
class Symbol extends Component{
    static displayName = 'Symbol';
    static propType = {
        id: PropTypes.string.isRequired
    };
    render() {
        let {props} = this;
        return <Defs.Item
            id={props.id}
            svgId={props.svgId}
        >
            <ViewBox
                viewbox={props.viewbox}
                preserveAspectRatio={props.preserveAspectRatio}
                width={props.width}
                height={props.height}
                shouldTransform={true}
            >
                {props.children}
            </ViewBox>
        </Defs.Item>
    }
}

export default Symbol;
