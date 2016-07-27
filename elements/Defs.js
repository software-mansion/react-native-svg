import React, {
    Component,
} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';

class Defs extends Component {
    static displayName = 'Defs';

    render() {
        return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
    }
}

const RNSVGDefs = createReactNativeComponentClass({
    validAttributes: {},
    uiViewClassName: 'RNSVGDefs'
});

export default Defs;
