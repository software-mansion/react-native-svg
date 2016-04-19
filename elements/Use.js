import React, {
    Component,
    PropTypes,
    cloneElement
} from 'react-native';
import Defs from './Defs';
class Use extends Component{
    static displayName = 'Use';
    static propType = {
        href: PropTypes.string
    };

    render() {
        return <Defs.Use {...this.props} />;
    }
}

export default Use;
