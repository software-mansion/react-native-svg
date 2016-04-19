import React, {
    Component,
    PropTypes
} from 'react-native';
class Stop extends Component{
    static displayName = 'Stop';
    static propTypes = {
        stopColor: PropTypes.string,
        stopOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
    render() {
        return null;
    }
}

export default Stop;

