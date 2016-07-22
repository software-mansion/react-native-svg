import React, {Component, PropTypes} from 'react';

import ViewBox from './ViewBox';
import G from './G';

class SymbolElement extends Component{
    static displayName = 'Symbol';
    static propType = {
        id: PropTypes.string.isRequired
    };
    render() {
        let {props} = this;

        return <G id={props.id}>
            <ViewBox
                {...props}
                viewbox={props.viewbox}
                preserveAspectRatio={props.preserveAspectRatio}
            >
                {props.children}
            </ViewBox>
        </G>;
    }
}

export default SymbolElement;
