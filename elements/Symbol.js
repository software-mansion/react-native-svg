import React, {Component, PropTypes} from 'react';

import ViewBox from './ViewBox';
import Defs from './Defs';
class SymbolElement extends Component{
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
                {...props}
                viewbox={props.viewbox}
                preserveAspectRatio={props.preserveAspectRatio}
            >
                {props.children}
            </ViewBox>
        </Defs.Item>;
    }
}

export default SymbolElement;
