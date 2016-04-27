import React, {
    Component,
    PropTypes,
    Children
} from 'react-native';
import {NativeGroup} from './G';
import {set, remove} from '../lib/extract/extractClipping';

class ClipPath extends Component{
    static displayName = 'ClipPath';
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    constructor() {
        super(...arguments);
        this.id = this.props.id + ':' + this.props.svgId;
    }

    componentWillReceiveProps = nextProps => {
        let id = nextProps.id + ':' + nextProps.svgId;
        if (id !== this.id) {
            remove(this.id);
        }
    };

    componentWillUnmount = () => {
        remove(this.id);
    };

    render() {
        set(this.id, this.id);

        return <NativeGroup
            asClipPath={this.id}
            opacity={1}
        >{this.props.children}</NativeGroup>;
    }
}

export default ClipPath;

