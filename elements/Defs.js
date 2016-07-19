import React, {
    Component,
} from 'react'
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';

class Defs extends Component {
    static displayName = 'Defs';

    render() {
        return <RNSVGDefination>{this.props.children}</RNSVGDefination>;
    }
}

const RNSVGDefination = createReactNativeComponentClass({
    validAttributes: {},
    uiViewClassName: 'RNSVGDefination'
});

export default Defs;
