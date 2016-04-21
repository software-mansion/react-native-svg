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

    _combinePaths = children => {
        // TODO: combine g elements and their children
        // TODO: combine text elements
        Children.forEach(children, child => {
            let {props, type: {getPath}} = child;

            if (getPath) {
                this._path += getPath(props);
            }

            this._combinePaths(props.children);
        });
    };

    _path = '';

    render() {
        this._combinePaths(this.props.children);
        set(this.id, this._path);
        return <NativeGroup />;
    }
}

export default ClipPath;

