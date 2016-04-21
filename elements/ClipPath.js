import React, {
    Component,
    PropTypes,
    Children
} from 'react-native';
import {NativeGroup} from './G';

class ClipPath extends Component{
    static displayName = 'ClipPath';
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    render() {
        // TODO: 合并children路径
        // TODO: clip-rule
        return <NativeGroup />;
    }
}

export default ClipPath;

